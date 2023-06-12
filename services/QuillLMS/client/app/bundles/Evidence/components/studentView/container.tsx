import * as React from "react";
import { convertNodeToElement } from 'react-html-parser';
import { connect } from "react-redux";
import { stripHtml } from "string-strip-html";

import ActivityFollowUp from './activityFollowUp';
import ReadPassageContainer from './readPassageContainer';
import RightPanel from './rightPanel';

import { BECAUSE, BUT, CHECKLIST, CLICK, INTRODUCTION, KEYDOWN, KEYPRESS, MOUSEDOWN, MOUSEMOVE, READ_AND_HIGHLIGHT, READ_PASSAGE_STEP_NUMBER, SO, SO_PASSAGE_STEP_NUMBER, VISIBILITYCHANGE, roundMillisecondsToSeconds } from '../../../Shared/index';
import { getActivity, getTopicOptimalInfo } from "../../actions/activities";
import { TrackAnalyticsEvent } from "../../actions/analytics";
import { completeActivitySession, fetchActiveActivitySession, getFeedback, processUnfetchableSession, reportAProblem, saveActiveActivitySession, saveActivitySurveyResponse, setActiveStepForSession, setActivityIsCompleteForSession, setExplanationSlidesCompletedForSession, setPreviewSessionStep } from '../../actions/session';
import { everyOtherStepCompleted, getCurrentStepDataForEventTracking, getLastSubmittedResponse, getStrippedPassageHighlights, getUrlParam, onMobile, outOfAttemptsForActivePrompt } from '../../helpers/containerActionHelpers';
import { renderDirections } from '../../helpers/containerRenderHelpers';
import getParameterByName from '../../helpers/getParameterByName';
import { generateConceptResults, } from '../../libs/conceptResults';
import { Events } from '../../modules/analytics';
import { ActivitiesReducerState } from '../../reducers/activitiesReducer';
import { SessionReducerState } from '../../reducers/sessionReducer';
import { postTurkSession } from '../../utils/turkAPI';
import { explanationData } from "../activitySlides/explanationData";
import ExplanationSlide from "../activitySlides/explanationSlide";
import WelcomeSlide from "../activitySlides/welcomeSlide";
import LoadingSpinner from '../shared/loadingSpinner';

interface StudentViewContainerProps {
  dispatch: Function;
  activities: ActivitiesReducerState;
  session: SessionReducerState;
  location?: any;
  handleFinishActivity?: () => void;
  isTurk?: boolean;
  user: string;
  previewMode: boolean;
}

interface StudentViewContainerState {
  explanationSlideStep:  number;
  completedSteps: Array<number>;
  isIdle: boolean;
  showFocusState: boolean;
  startTime: number;
  timeTracking: { [key:string]: number };
  studentHighlights: string[];
  doneHighlighting: boolean;
  showReadTheDirectionsButton: boolean;
  scrolledToEndOfPassage: boolean;
  hasStartedReadPassageStep: boolean;
  hasStartedPromptSteps: boolean;
}

const ONBOARDING = 'onboarding'
const ALL_STEPS = [READ_PASSAGE_STEP_NUMBER, 2, 3, 4]
const MINIMUM_STUDENT_HIGHLIGHT_COUNT = 2

const STUDENT_HIGHLIGHT_STARTS_TEXT = "(highlighted text begins here)"
const STUDENT_HIGHLIGHT_ENDS_TEXT = "(highlighted text ends here)"
const PASSAGE_HIGHLIGHT_STARTS_TEXT = "(yellow underlined text begins here)"
const PASSAGE_HIGHLIGHT_ENDS_TEXT = "(yellow underlined text ends here)"

export const StudentViewContainer = ({ dispatch, session, isTurk, location, activities, handleFinishActivity, user, previewMode }: StudentViewContainerProps) => {
  const skipToSpecificStep = window.location.href.includes('skipToStep')
  const shouldSkipToPrompts = window.location.href.includes('turk') || window.location.href.includes('skipToPrompts') || skipToSpecificStep
  const defaultCompletedSteps = shouldSkipToPrompts ? [READ_PASSAGE_STEP_NUMBER] : []
  const sessionFromUrl = getUrlParam('session', location, isTurk)
  const activityUID = getUrlParam('uid', location, isTurk)

  const refs = {
    step1: React.useRef(),
    step2: React.useRef(),
    step3: React.useRef(),
    step4: React.useRef()
  }

  const inactivityTimer = React.useRef(null)

  const [explanationSlideStep, setExplanationSlideStep] = React.useState(0)
  const [completeButtonClicked, setCompleteButtonClicked] = React.useState(false)
  const [completedSteps, setCompletedSteps] = React.useState(defaultCompletedSteps)
  const [showFocusState, setShowFocusState] = React.useState(false)
  const [showStepsSummary, setShowStepsSummary] = React.useState(false)
  const [startTime, setStartTime] = React.useState(Date.now())
  const [isIdle, setIsIdle] = React.useState(false)
  const [studentHighlights, setStudentHighlights] = React.useState([])
  const [scrolledToEndOfPassage, setScrolledToEndOfPassage] = React.useState(shouldSkipToPrompts)
  const [hasStartedReadPassageStep, setHasStartedReadPassageStep] = React.useState(shouldSkipToPrompts)
  const [hasStartedPromptSteps, setHasStartedPromptsSteps] = React.useState(skipToSpecificStep)
  const [doneHighlighting, setDoneHighlighting] = React.useState(shouldSkipToPrompts)
  const [showReadTheDirectionsButton, setShowReadTheDirectionsButton] = React.useState(false)
  const [timeTracking, setTimeTracking] = React.useState({
    [ONBOARDING]: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0
  })

  React.useEffect(() => {
    if(hasStartedReadPassageStep || session.previewSessionStep === READ_AND_HIGHLIGHT) {
      const el = document.getElementById('end-of-passage')
      const observer = new IntersectionObserver(([entry]) => { entry.isIntersecting ? setScrolledToEndOfPassage(entry.isIntersecting) : null; });

      el && observer.observe(el);
    }
  }, [hasStartedReadPassageStep, session.previewSessionStep]);

  React.useEffect(() => {
    dispatch(getTopicOptimalInfo(activityUID))
    if (sessionFromUrl) {
      const fetchActiveActivitySessionArgs = {
        sessionID: sessionFromUrl,
        activityUID: activityUID,
        callback: loadPreviousSession
      }
      dispatch(getActivity(sessionFromUrl, activityUID))
        .then(() => {
          dispatch(fetchActiveActivitySession(fetchActiveActivitySessionArgs))
        })
    } else {
      if (activityUID) {
        const { sessionID, } = session
        dispatch(getActivity(sessionID, activityUID))
        dispatch(processUnfetchableSession(sessionID));
        if (isTurk) {
          isTurk && handlePostTurkSession(sessionID);
        } else if (!skipToSpecificStep) {
          window.location.href = `${window.location.href}&session=${sessionID}`
        }
      }
    }
  }, [])

  React.useEffect(() => {
    window.addEventListener(KEYDOWN, handleKeyDown)
    window.addEventListener(MOUSEMOVE, resetTimers)
    window.addEventListener(MOUSEDOWN, resetTimers)
    window.addEventListener(CLICK, handleClick)
    window.addEventListener(KEYPRESS, resetTimers)
    window.addEventListener(VISIBILITYCHANGE, setIdle)

    return function cleanup() {
      window.removeEventListener(KEYDOWN, handleKeyDown)
      window.removeEventListener(MOUSEMOVE, resetTimers)
      window.removeEventListener(MOUSEDOWN, resetTimers)
      window.removeEventListener(CLICK, handleClick)
      window.removeEventListener(KEYPRESS, resetTimers)
      window.removeEventListener(VISIBILITYCHANGE, setIdle)
    }
  }, [session, activities, hasStartedPromptSteps, inactivityTimer, isIdle])

  React.useEffect(() => { activities.currentActivity ? document.title = `Quill.org | ${activities.currentActivity.title}` : null }, [activities.currentActivity])

  React.useEffect(() => {
    const { activeStep } = session;
    if (!outOfAttemptsForActivePrompt(activeStep, session, activities)) { return }

    if (!everyOtherStepCompleted(activeStep, completedSteps)) { return }

    completeStep(activeStep)
  }, [session.submittedResponses])

  React.useEffect(() => {
    if (onMobile()) { window.scrollTo(0, 0) }
  }, [doneHighlighting])

  React.useEffect(() => {
    if (completedSteps.length === defaultCompletedSteps.length || !activities.currentActivity ) { return }

    const uniqueCompletedSteps = Array.from(new Set(completedSteps))
    const { activeStep } = session;

    // Don't go to the next step if we haven't flagged the current step as completed
    // This particular condition can occur when loading data from a partially-completed session which triggers this effect
    if (!uniqueCompletedSteps.includes(activeStep)) return

    let nextStep: number|undefined = activeStep + 1
    if (nextStep > ALL_STEPS.length || uniqueCompletedSteps.includes(nextStep)) {
      nextStep = ALL_STEPS.find(s => !uniqueCompletedSteps.includes(s))
    }

    if (nextStep) {
      // don't activate a step if it's already active
      if (activeStep === nextStep) return
      // // don't activate nextSteps before Done reading button has been clicked
      if (nextStep && nextStep > 1 && !completedSteps.includes(READ_PASSAGE_STEP_NUMBER)) return

      dispatch(setActiveStepForSession(nextStep))
      setStartTime(Date.now())
      trackCurrentPromptStartedEvent()
      callSaveActiveActivitySession()
    } else {
      trackActivityCompletedEvent(); // If there is no next step, the activity is done
    }
  }, [completedSteps, activities.currentActivity])

  React.useEffect(() => {
    const { activeStep } = session;
    activeStep !== READ_PASSAGE_STEP_NUMBER ? scrollToStep(`step${activeStep}`) : null
  }, [session.activeStep])

  function handleReadPassageContainerScroll(e=null) {
    if (e) { resetTimers(e) }
  }

  function preparePreviewIntroductionStep() {
    dispatch(setPreviewSessionStep(INTRODUCTION))
    dispatch(setActiveStepForSession(1))
    dispatch(setExplanationSlidesCompletedForSession(false))
    dispatch(setActivityIsCompleteForSession(false))
    setExplanationSlideStep(0)
    setHasStartedReadPassageStep(false)
    setShowReadTheDirectionsButton(false)
    setScrolledToEndOfPassage(false)
    setDoneHighlighting(false)
    setHasStartedPromptsSteps(false)
    setCompleteButtonClicked(false)
    setCompletedSteps([])
  }

  function preparePreviewChecklistStep() {
    dispatch(setPreviewSessionStep(CHECKLIST))
    dispatch(setActiveStepForSession(1))
    dispatch(setExplanationSlidesCompletedForSession(true))
    dispatch(setActivityIsCompleteForSession(false))
    setHasStartedReadPassageStep(false)
    setShowReadTheDirectionsButton(false)
    setScrolledToEndOfPassage(false)
    setDoneHighlighting(false)
    setHasStartedPromptsSteps(false)
    setCompleteButtonClicked(false)
    setCompletedSteps([])
  }

  function preparePreviewReadAndHighlightStep() {
    dispatch(setPreviewSessionStep(READ_AND_HIGHLIGHT))
    dispatch(setActiveStepForSession(1))
    dispatch(setExplanationSlidesCompletedForSession(true))
    dispatch(setActivityIsCompleteForSession(false))
    setHasStartedReadPassageStep(true)
    setShowReadTheDirectionsButton(true)
    setScrolledToEndOfPassage(false)
    setStudentHighlights([])
    setDoneHighlighting(false)
    setHasStartedPromptsSteps(false)
    setCompleteButtonClicked(false)
  }

  function preparePreviewBecauseStep() {
    dispatch(setPreviewSessionStep(BECAUSE))
    dispatch(setActiveStepForSession(2))
    dispatch(setExplanationSlidesCompletedForSession(true))
    dispatch(setActivityIsCompleteForSession(false))
    setHasStartedReadPassageStep(true)
    setShowReadTheDirectionsButton(false)
    setScrolledToEndOfPassage(true)
    setDoneHighlighting(true)
    setHasStartedPromptsSteps(true)
    setCompleteButtonClicked(false)
    setCompletedSteps([1])
  }

  function preparePreviewButStep() {
    dispatch(setPreviewSessionStep(BUT))
    dispatch(setActiveStepForSession(3))
    dispatch(setExplanationSlidesCompletedForSession(true))
    dispatch(setActivityIsCompleteForSession(false))
    setHasStartedReadPassageStep(true)
    setShowReadTheDirectionsButton(false)
    setScrolledToEndOfPassage(true)
    setDoneHighlighting(true)
    setHasStartedPromptsSteps(true)
    setCompleteButtonClicked(false)
    setCompletedSteps([1, 2])
  }

  function preparePreviewSoStep() {
    dispatch(setPreviewSessionStep(SO))
    dispatch(setActiveStepForSession(4))
    dispatch(setExplanationSlidesCompletedForSession(true))
    dispatch(setActivityIsCompleteForSession(false))
    setHasStartedReadPassageStep(true)
    setShowReadTheDirectionsButton(false)
    setScrolledToEndOfPassage(true)
    setDoneHighlighting(true)
    setHasStartedPromptsSteps(true)
    setCompleteButtonClicked(false)
    setCompletedSteps([1, 2, 3])
  }

  React.useEffect(() => {
    const { previewSessionStep } = session;

    if(previewSessionStep === INTRODUCTION) {
      preparePreviewIntroductionStep()
    }
    if(previewSessionStep === CHECKLIST) {
      preparePreviewChecklistStep()
    }
    if(previewSessionStep === READ_AND_HIGHLIGHT) {
      preparePreviewReadAndHighlightStep()
    }
    if(previewSessionStep === BECAUSE) {
      preparePreviewBecauseStep()
    }
    if (previewSessionStep === BUT) {
      preparePreviewButStep()
    }
    if (previewSessionStep === SO) {
      preparePreviewSoStep()
    }

  }, [session.previewSessionStep])

  function handleReadTheDirectionsButtonClick(e) {
    // prevents firing when clicking back to read and highlight step again during preview mode
    if(!e && previewMode) { return }
    setShowReadTheDirectionsButton(false)
  }

  function resetTimers(e=null) {
    const now = Date.now()
    const { activeStep } = session;
    if (completedSteps.includes(activeStep)) { return } // don't want to add time if a user is revisiting a previously completed step
    if (outOfAttemptsForActivePrompt(activeStep, session, activities)) { return } // or if they are finished submitting responses for the current active step
    if (activeStep > READ_PASSAGE_STEP_NUMBER && !hasStartedPromptSteps) { return } // or if they are between the read passage step and starting the prompts

    let elapsedTime = now - startTime
    if (isIdle) {
      elapsedTime = 0
    }
    const { explanationSlidesCompleted } = session;
    const activeStepKey = explanationSlidesCompleted ? activeStep : ONBOARDING
    const newTimeTracking = {...timeTracking, [activeStepKey]: timeTracking[activeStepKey] + elapsedTime}

    setTimeTracking(newTimeTracking)
    setIsIdle(false)
    setStartTime(now)
    inactivityTimerReset()

    return Promise.resolve(true);
  }

  function inactivityTimerReset() {
    if (inactivityTimer.current) { clearTimeout(inactivityTimer.current) }
    inactivityTimer.current = setTimeout(setIdle, 30000) // time is in milliseconds (1000 is 1 second)
  }

  function setIdle() {
    setIsIdle(true)
    setStartTime(Date.now())
    inactivityTimerReset()
  }

  function handlePostTurkSession(activitySessionId: string) {
    const turkingRoundID = getParameterByName('id', window.location.href);
    postTurkSession(turkingRoundID, activitySessionId).then(response => {
      const { error } = response;
      if(error) {
        alert(`${error}`);
      }
    });
  }

  function defaultHandleFinishActivity() {
    const { sessionID, submittedResponses, } = session
    const { currentActivity, topicOptimalData } = activities
    const percentage = null // We always set percentages to "null"
    const conceptResults = generateConceptResults(currentActivity, submittedResponses, topicOptimalData)
    const data = {
      time_tracking: {
        onboarding: roundMillisecondsToSeconds(timeTracking[ONBOARDING]),
        reading: roundMillisecondsToSeconds(timeTracking[READ_PASSAGE_STEP_NUMBER]),
        because: roundMillisecondsToSeconds(timeTracking[2]),
        but: roundMillisecondsToSeconds(timeTracking[3]),
        so: roundMillisecondsToSeconds(timeTracking[4]),
      },
      student_highlights: studentHighlights
    }
    const callback = handleFinishActivity ? handleFinishActivity : () => {}
    dispatch(completeActivitySession(sessionID, currentActivity.parent_activity_id, percentage, conceptResults, data, callback))
  }

  function loadPreviousSession(data) {
    const { activeStep } = session;
    const highlights = data.studentHighlights || studentHighlights
    // if the student hasn't gotten to the highlighting stage yet,
    // we don't want them to skip seeing the directions modal and reading the passage again
    const studentHasAtLeastStartedHighlighting = (highlights && highlights.length) || shouldSkipToPrompts
    dispatch(setActiveStepForSession(data.activeStep || activeStep))
    setCompletedSteps(data.completedSteps || completedSteps)
    setTimeTracking(data.timeTracking || timeTracking)
    setStudentHighlights(highlights)
    setHasStartedReadPassageStep(studentHasAtLeastStartedHighlighting)
    setScrolledToEndOfPassage(studentHasAtLeastStartedHighlighting)
    setDoneHighlighting((studentHasAtLeastStartedHighlighting && highlights.length >= MINIMUM_STUDENT_HIGHLIGHT_COUNT) || shouldSkipToPrompts)
  }

  function activateStep(step) { dispatch(setActiveStepForSession(step)) }

  function submitResponse(entry: string, promptID: string, promptText: string, attempt: number, currentActivity: object) {
    const { sessionID, } = session
    const activityUID = getUrlParam('uid', location, isTurk)
    const previousFeedback = session.submittedResponses[promptID] || [];
    // strip any HTML injected by browser extensions (such as Chrome highlight)
    const strippedEntry = stripHtml(entry).result;
    if (activityUID) {
      const args = {
        sessionID,
        activityUID,
        entry: strippedEntry,
        promptID,
        promptText,
        attempt,
        previousFeedback,
        callback: submitResponseCallback,
        activityVersion: currentActivity?.version,
      }
      dispatch(getFeedback(args))
    }
  }

  function trackPassageReadEvent() {
    const { sessionID, } = session
    const activityUID = getUrlParam('uid', location, isTurk)

    dispatch(TrackAnalyticsEvent(Events.EVIDENCE_PASSAGE_READ, {
      activityID: activityUID,
      sessionID: sessionID
    }));
  }

  function trackCurrentPromptStartedEvent() {
    const { activeStep } = session;
    const trackingParams = getCurrentStepDataForEventTracking({ activeStep, activities, session, isTurk })
    if (!trackingParams) return; // Bail if there's no data to track

    dispatch(TrackAnalyticsEvent(Events.EVIDENCE_PROMPT_STARTED, trackingParams))
  }

  function trackCurrentPromptCompletedEvent() {
    const { activeStep } = session;
    const trackingParams = getCurrentStepDataForEventTracking({ activeStep, activities, session, isTurk })
    if (!trackingParams) return; // Bail if there's no data to track

    dispatch(TrackAnalyticsEvent(Events.EVIDENCE_PROMPT_COMPLETED, trackingParams))
  }

  function trackActivityCompletedEvent() {
    const { sessionID, } = session
    const activityID = getUrlParam('uid', location, isTurk)
    if(!previewMode) {
      dispatch(TrackAnalyticsEvent(Events.EVIDENCE_ACTIVITY_COMPLETED, {
        activityID,
        sessionID
      }));
    }
    dispatch(setActivityIsCompleteForSession(true));
    if(!previewMode) {
      defaultHandleFinishActivity()
    } else if(previewMode && session.previewSessionStep === SO) {
      dispatch(setPreviewSessionStep('complete'))
      setCompleteButtonClicked(true)
    }
  }

  function completeStep(stepNumber: number) {
    const newCompletedSteps = completedSteps.concat(stepNumber)
    const uniqueCompletedSteps = Array.from(new Set(newCompletedSteps))
    trackCurrentPromptCompletedEvent()
    setCompletedSteps(uniqueCompletedSteps)
    // we only want to render the step summary list again after completing the because and but prompts
    if(stepNumber > READ_PASSAGE_STEP_NUMBER && stepNumber < SO_PASSAGE_STEP_NUMBER) {
      setShowStepsSummary(true);
    }
    // preview mode actions
    if(previewMode && stepNumber === 1) {
      preparePreviewBecauseStep()
    } else if(previewMode && stepNumber === 2) {
      preparePreviewButStep()
    } else if(previewMode && stepNumber === 3) {
      preparePreviewSoStep()
    }
  }

  function handleClick(e) {
    if (showReadTheDirectionsButton && e.target.className.indexOf('read-the-directions-modal') === -1) {
      handleReadTheDirectionsButtonClick()
    }

    resetTimers(e)
  }

  function handleKeyDown(e) {
    if (e.key !== 'Tab' || showFocusState) { return }

    setShowFocusState(true)
  }

  function handleDoneReadingClick() {
    completeStep(READ_PASSAGE_STEP_NUMBER)
    const scrollContainer = document.getElementsByClassName("read-passage-container")[0]
    scrollContainer.scrollTo(0, 0)
    if(!previewMode) {
      trackPassageReadEvent();
    }
  }

  function onStartReadPassage(e) {
    e.stopPropagation()
    if (previewMode) {
      preparePreviewReadAndHighlightStep()
    } else {
      setHasStartedReadPassageStep(true)
      setShowReadTheDirectionsButton(true)
    }
  }

  function onStartPromptSteps() {
    if(previewMode) {
      preparePreviewBecauseStep()
    } else {
      setHasStartedPromptsSteps(true)
    }
  }

  function submitProblemReport(args) {
    const { sessionID, } = session
    const lastSubmittedResponse = getLastSubmittedResponse({ activities, session, activeStep });
    const isOptimal = lastSubmittedResponse && lastSubmittedResponse.optimal;
    reportAProblem({...args, sessionID, isOptimal})
  }

  function handleClickDoneHighlighting() {
    setDoneHighlighting(true)
  }

  function scrollToStep(ref: string) {
    if (onMobile()) {
      scrollToStepOnMobile(ref)
    } else {
      const scrollContainer = document.getElementsByClassName("steps-outer-container")[0]
      const el = refs[ref]

      if (scrollContainer) {
        scrollContainer.scrollTo(0, el.offsetTop - 34)
      }
    }
  }

  function scrollToHighlight() {
    const passageHighlights = document.getElementsByClassName('passage-highlight')
    if (!passageHighlights.length) { return }

    const el = passageHighlights[0].parentElement

    // we want to scroll 24px above the top of the paragraph, but we have to use 84 because of the 60px padding set at the top of the activity-container element
    const additionalTopOffset = 84

    if (onMobile()) {
      el.scrollIntoView(true)
      window.scrollBy(0, -additionalTopOffset)
    } else {
      const scrollContainer = document.getElementsByClassName("read-passage-container")[0]
      scrollContainer.scrollTo(0, el.offsetTop - additionalTopOffset)
    }
  }

  function callSaveActiveActivitySession() {
    // we don't want to save an active activity session during preview mode because it will cause inconsistent behavior if page is refreshed
    if(previewMode) { return }

    const args = {
      completedSteps,
      timeTracking,
      studentHighlights,
    }
    dispatch(saveActiveActivitySession(args))
  }

  function submitResponseCallback() {
    callSaveActiveActivitySession()
    scrollToHighlight()
  }

  function scrollToStepOnMobile(ref: string) {
    refs[ref].current ? refs[ref].current.scrollIntoView(false) : null
  }

  function handleHighlightKeyDown(e) {
    if (e.key !== 'Enter') { return }
    toggleStudentHighlight(e.currentTarget.textContent)
  }

  function handleHighlightClick(e) {
    toggleStudentHighlight(e.currentTarget.textContent)
  }

  function toggleStudentHighlight(stringText) {
    const textWithHighlightContentRemoved = stringText.replace(STUDENT_HIGHLIGHT_STARTS_TEXT, '').replace(STUDENT_HIGHLIGHT_ENDS_TEXT, '')
    let newHighlights = []

    if (studentHighlights.includes(textWithHighlightContentRemoved)) {
      newHighlights = studentHighlights.filter(hl => hl !== textWithHighlightContentRemoved)
    } else {
      newHighlights = studentHighlights.concat(stringText)
    }

    setStudentHighlights(newHighlights)
  }

  function toggleShowStepsSummary() {
    setShowStepsSummary(!showStepsSummary)
  }

  React.useEffect(() => {
    if (studentHighlights.length === 0 ) { return }
    callSaveActiveActivitySession()
  }, [studentHighlights])

  function stringifiedInnerElementsHelper(node) {
    if (node.data) { return node.data }
    if (node.children.length > 0) { return node.children.map(n => stringifiedInnerElementsHelper(n)).join(''); }
    return ''
  }

  function transformMarkTags(node) {
    const { activeStep } = session;
    const strippedPassageHighlights = getStrippedPassageHighlights({ activities, session, activeStep });


    if (['p'].includes(node.name) && activeStep > 1 && strippedPassageHighlights && strippedPassageHighlights.length) {
      const stringifiedInnerElements = node.children.map(n => stringifiedInnerElementsHelper(n)).join('');

      if (!stringifiedInnerElements) { return }

      const highlightIncludesElement = strippedPassageHighlights.find(ph => ph.includes(stringifiedInnerElements)) // handles case where passage highlight spans more than one paragraph
      const elementIncludesHighlight = strippedPassageHighlights.find(ph => stringifiedInnerElements.includes(ph)) // handles case where passage highlight is only part of paragraph

      if (highlightIncludesElement) {
        return (
          <p>
            <span className="passage-highlight">
              <span className="sr-only">{PASSAGE_HIGHLIGHT_STARTS_TEXT}</span>
              {stringifiedInnerElements}
              <span className="sr-only">{PASSAGE_HIGHLIGHT_ENDS_TEXT}</span>
            </span>
          </p>
        )
      }
      if (elementIncludesHighlight) {
        let newStringifiedInnerElements = stringifiedInnerElements
        strippedPassageHighlights.forEach(ph => newStringifiedInnerElements = newStringifiedInnerElements.replace(ph, `<span class="passage-highlight"><span class="sr-only">${PASSAGE_HIGHLIGHT_STARTS_TEXT}</span>${ph}<span class="sr-only">${PASSAGE_HIGHLIGHT_ENDS_TEXT}</span></span>`))
        return <p dangerouslySetInnerHTML={{ __html: newStringifiedInnerElements }} />
      }
    }

    if (node.name === 'mark') {
      const shouldBeHighlightable = !doneHighlighting && !showReadTheDirectionsButton && hasStartedReadPassageStep
      let innerElements = node.children.map((n, i) => convertNodeToElement(n, i, transformMarkTags))
      const stringifiedInnerElements = node.children.map(n => stringifiedInnerElementsHelper(n)).join('');
      let className = ''
      const highlighted = studentHighlights.includes(stringifiedInnerElements)
      if(activeStep === 1 && highlighted) {
        className += ' highlighted'
        const firstElement = <span className="sr-only">{STUDENT_HIGHLIGHT_STARTS_TEXT}</span>
        const lastElement = <span className="sr-only">{STUDENT_HIGHLIGHT_ENDS_TEXT}</span>
        innerElements = [firstElement, ...innerElements, lastElement]
      }
      className += shouldBeHighlightable  ? ' highlightable' : ''
      if (!shouldBeHighlightable) { return <mark className={className}>{innerElements}</mark>}
      /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */
      return <mark aria-pressed={highlighted} className={className} onClick={handleHighlightClick} onKeyDown={handleHighlightKeyDown} role="button" tabIndex={0}>{innerElements}</mark>
    }
  }

  function handleExplanationSlideClick() {
    const nextStep = explanationSlideStep + 1;
    if (nextStep > 3 && previewMode) {
      preparePreviewChecklistStep()
    } else if (nextStep > 3) {
      dispatch(setExplanationSlidesCompletedForSession(true))
    } else {
      setExplanationSlideStep(nextStep)
    }
  }

  const { submittedResponses, sessionID, explanationSlidesCompleted, activeStep, activityIsComplete } = session;

  if (!activities.hasReceivedData) { return <LoadingSpinner /> }

  const className = `activity-container ${showFocusState ? '' : 'hide-focus-outline'} ${activeStep === READ_PASSAGE_STEP_NUMBER ? 'on-read-passage' : ''}`

  if(!explanationSlidesCompleted) {
    if (explanationSlideStep === 0) {
      return <WelcomeSlide onHandleClick={handleExplanationSlideClick} user={user} />
    }
    return(
      <ExplanationSlide onHandleClick={handleExplanationSlideClick} slideData={explanationData[explanationSlideStep]} />
    );
  }

  if(completeButtonClicked && !window.location.href.includes('turk')) {
    return(
      <ActivityFollowUp activity={activities.currentActivity} dispatch={dispatch} previewMode={previewMode} responses={submittedResponses} saveActivitySurveyResponse={saveActivitySurveyResponse} sessionID={sessionID} />
    );
  }

  const completionButtonCallback = () => {
    setCompleteButtonClicked(true)
  }

  return (
    <div className={className}>
      {renderDirections({
        handleReadTheDirectionsButtonClick,
        activeStep,
        doneHighlighting,
        showReadTheDirectionsButton,
        activities,
        hasStartedReadPassageStep,
        hasStartedPromptSteps
      })}
      <ReadPassageContainer
        activeStep={activeStep}
        activities={activities}
        handleReadPassageContainerScroll={handleReadPassageContainerScroll}
        hasStartedPromptSteps={hasStartedPromptSteps}
        hasStartedReadPassageStep={hasStartedReadPassageStep}
        scrolledToEndOfPassage={scrolledToEndOfPassage}
        showReadTheDirectionsButton={showReadTheDirectionsButton}
        transformMarkTags={transformMarkTags}
      />
      <RightPanel
        activateStep={activateStep}
        activeStep={activeStep}
        activities={activities}
        activityIsComplete={activityIsComplete}
        completedSteps={completedSteps}
        completeStep={completeStep}
        completionButtonCallback={completionButtonCallback}
        doneHighlighting={doneHighlighting}
        handleClickDoneHighlighting={handleClickDoneHighlighting}
        handleDoneReadingClick={handleDoneReadingClick}
        handleReadTheDirectionsButtonClick={handleReadTheDirectionsButtonClick}
        hasStartedPromptSteps={hasStartedPromptSteps}
        hasStartedReadPassageStep={hasStartedReadPassageStep}
        onStartPromptSteps={onStartPromptSteps}
        onStartReadPassage={onStartReadPassage}
        reportAProblem={submitProblemReport}
        resetTimers={resetTimers}
        scrolledToEndOfPassage={scrolledToEndOfPassage}
        session={session}
        showReadTheDirectionsButton={showReadTheDirectionsButton}
        showStepsSummary={showStepsSummary}
        studentHighlights={studentHighlights}
        submitResponse={submitResponse}
        toggleShowStepsSummary={toggleShowStepsSummary}
        toggleStudentHighlight={toggleStudentHighlight}
      />
    </div>
  )

}

const mapStateToProps = (state: any) => {
  return {
    activities: state.activities,
    session: state.session
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentViewContainer);
