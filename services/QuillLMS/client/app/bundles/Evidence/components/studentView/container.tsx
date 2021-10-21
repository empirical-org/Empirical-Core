import * as React from "react";
import { connect } from "react-redux";
import stripHtml from "string-strip-html";
import { convertNodeToElement } from 'react-html-parser'

import RightPanel from './rightPanel'
import ActivityFollowUp from './activityFollowUp';

import { explanationData } from "../activitySlides/explanationData";
import ExplanationSlide from "../activitySlides/explanationSlide";
import WelcomeSlide from "../activitySlides/welcomeSlide";
import LoadingSpinner from '../shared/loadingSpinner'
import { getActivity } from "../../actions/activities";
import { TrackAnalyticsEvent } from "../../actions/analytics";
import { Events } from '../../modules/analytics'
import { completeActivitySession, fetchActiveActivitySession, getFeedback, processUnfetchableSession, saveActiveActivitySession, saveActivitySurveyResponse, reportAProblem, } from '../../actions/session'
import { generateConceptResults, } from '../../libs/conceptResults'
import { ActivitiesReducerState } from '../../reducers/activitiesReducer'
import { SessionReducerState } from '../../reducers/sessionReducer'
import getParameterByName from '../../helpers/getParameterByName';
import { getUrlParam, onMobile, outOfAttemptsForActivePrompt, getCurrentStepDataForEventTracking, everyOtherStepCompleted, getStrippedPassageHighlights } from '../../helpers/containerActionHelpers';
import { renderStepLinksAndDirections, renderReadPassageContainer } from '../../helpers/containerRenderHelpers';
import { postTurkSession } from '../../utils/turkAPI';
import { roundMillisecondsToSeconds, KEYDOWN, MOUSEMOVE, MOUSEDOWN, CLICK, KEYPRESS, VISIBILITYCHANGE, TOUCHMOVE, } from '../../../Shared/index'

interface StudentViewContainerProps {
  dispatch: Function;
  activities: ActivitiesReducerState;
  session: SessionReducerState;
  location?: any;
  handleFinishActivity?: () => void;
  isTurk?: boolean;
  user: string;
}

interface StudentViewContainerState {
  activeStep?: number;
  activityIsComplete: boolean;
  activityIsReadyForSubmission: boolean;
  explanationSlidesCompleted: boolean;
  explanationSlideStep:  number;
  completedSteps: Array<number>;
  isIdle: boolean;
  showFocusState: boolean;
  startTime: number;
  timeTracking: { [key:string]: number };
  studentHighlights: string[];
  doneHighlighting: boolean;
  showReadTheDirectionsModal: boolean;
  scrolledToEndOfPassage: boolean;
  hasStartedReadPassageStep: boolean;
  hasStartedPromptSteps: boolean;
}

const ONBOARDING = 'onboarding'
const READ_PASSAGE_STEP = 1
const ALL_STEPS = [READ_PASSAGE_STEP, 2, 3, 4]
const MINIMUM_STUDENT_HIGHLIGHT_COUNT = 2

export const StudentViewContainer = ({ dispatch, session, isTurk, location, activities, handleFinishActivity, user, }: StudentViewContainerProps) => {
  const activityCompletionCount: number = parseInt(getParameterByName('activities', window.location.href, '0'));
  const shouldSkipToPrompts = window.location.href.includes('turk') || window.location.href.includes('skipToPrompts') || activityCompletionCount > 3
  const defaultCompletedSteps = shouldSkipToPrompts ? [READ_PASSAGE_STEP] : []

  const refs = {
    step1: React.useRef(),
    step2: React.useRef(),
    step3: React.useRef(),
    step4: React.useRef()
  }

  const [explanationSlideStep, setExplanationSlideStep] = React.useState(0)
  const [explanationSlidesCompleted, setExplanationSlidesCompleted] = React.useState(shouldSkipToPrompts)
  const [activeStep, setActiveStep] = React.useState(shouldSkipToPrompts ? READ_PASSAGE_STEP + 1: READ_PASSAGE_STEP)
  const [activityIsComplete, setActivityIsComplete] = React.useState(false)
  const [activityIsReadyForSubmission, setActivityIsReadyForSubmission] = React.useState(false)
  const [completedSteps, setCompletedSteps] = React.useState(defaultCompletedSteps)
  const [showFocusState, setShowFocusState] = React.useState(false)
  const [startTime, setStartTime] = React.useState(Date.now())
  const [isIdle, setIsIdle] = React.useState(false)
  const [inactivityTimer, setInactivityTimer] = React.useState(null)
  const [studentHighlights, setStudentHighlights] = React.useState([])
  const [scrolledToEndOfPassage, setScrolledToEndOfPassage] = React.useState(shouldSkipToPrompts)
  const [hasStartedReadPassageStep, setHasStartedReadPassageStep] = React.useState(shouldSkipToPrompts)
  const [hasStartedPromptSteps, setHasStartedPromptsSteps] = React.useState(shouldSkipToPrompts)
  const [doneHighlighting, setDoneHighlighting] = React.useState(shouldSkipToPrompts)
  const [showReadTheDirectionsModal, setShowReadTheDirectionsModal] = React.useState(false)
  const [timeTracking, setTimeTracking] = React.useState({
    [ONBOARDING]: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0
  })

  React.useEffect(() => {
    const el = document.getElementById('end-of-passage')
    const observer = new IntersectionObserver(([entry]) => { entry.isIntersecting ? setScrolledToEndOfPassage(entry.isIntersecting) : null; });

    el && observer.observe(el);
  }, [hasStartedReadPassageStep]);

  React.useEffect(() => {
    const activityUID = getUrlParam('uid', location, isTurk)
    const sessionFromUrl = getUrlParam('session', location, isTurk)
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
        isTurk && handlePostTurkSession(sessionID);
      }
    }

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
  }, [])

  React.useEffect(() => { activities.currentActivity ? document.title = `Quill.org | ${activities.currentActivity.title}` : null }, [activities.currentActivity])

  React.useEffect(() => {
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
    let nextStep: number|undefined = activeStep + 1
    if (nextStep > ALL_STEPS.length || uniqueCompletedSteps.includes(nextStep)) {
      nextStep = ALL_STEPS.find(s => !uniqueCompletedSteps.includes(s))
    }

    if (nextStep) {
      // don't activate a step if it's already active
      if (activeStep == nextStep) return
      // // don't activate nextSteps before Done reading button has been clicked
      if (nextStep && nextStep > 1 && !completedSteps.includes(READ_PASSAGE_STEP)) return

      setActiveStep(nextStep)
      setStartTime(Date.now())
      trackCurrentPromptStartedEvent()
    } else {
      trackActivityCompletedEvent(); // If there is no next step, the activity is done
    }
  }, [completedSteps, activities.currentActivity])

  React.useEffect(() => {
    activeStep !== READ_PASSAGE_STEP ? scrollToStep(`step${activeStep}`) : null
  }, [activeStep])

  function handleReadPassageContainerScroll(e=null) {
    if (e) { resetTimers(e) }
  }

  function closeReadTheDirectionsModal() { setShowReadTheDirectionsModal(false) }

  function resetTimers(e=null) {
    const now = Date.now()
    if (completedSteps.includes(activeStep)) { return } // don't want to add time if a user is revisiting a previously completed step
    if (outOfAttemptsForActivePrompt(activeStep, session, activities)) { return } // or if they are finished submitting responses for the current active step
    if (activeStep > READ_PASSAGE_STEP && !hasStartedPromptSteps) { return } // or if they are between the read passage step and starting the prompts

    if (inactivityTimer) { clearTimeout(inactivityTimer) }

    let elapsedTime = now - startTime
    if (isIdle) {
      elapsedTime = 0
    }

    const activeStepKey = explanationSlidesCompleted ? activeStep : ONBOARDING
    const newTimeTracking = {...timeTracking, [activeStepKey]: timeTracking[activeStepKey] + elapsedTime}
    const newInactivityTimer = setTimeout(setIdle, 30000);  // time is in milliseconds (1000 is 1 second)

    setTimeTracking(newTimeTracking)
    setIsIdle(false)
    setInactivityTimer(newInactivityTimer)
    setStartTime(now)

    return Promise.resolve(true);
  }

  function setIdle() { resetTimers().then(() => setIsIdle(true)) }

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
    const { currentActivity, } = activities
    const percentage = null // We always set percentages to "null"
    const conceptResults = generateConceptResults(currentActivity, submittedResponses)
    const data = {
      time_tracking: {
        onboarding: roundMillisecondsToSeconds(timeTracking[ONBOARDING]),
        reading: roundMillisecondsToSeconds(timeTracking[READ_PASSAGE_STEP]),
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
    const highlights = data.studentHighlights || studentHighlights
    // if the student hasn't gotten to the highlighting stage yet,
    // we don't want them to skip seeing the directions modal and reading the passage again
    const studentHasAtLeastStartedHighlighting = highlights && highlights.length
    setActiveStep(data.activeStep || activeStep)
    setCompletedSteps(data.completedSteps || completedSteps)
    setTimeTracking(data.timeTracking || timeTracking)
    setStudentHighlights(highlights)
    setHasStartedReadPassageStep(studentHasAtLeastStartedHighlighting)
    setScrolledToEndOfPassage(studentHasAtLeastStartedHighlighting)
    setDoneHighlighting(studentHasAtLeastStartedHighlighting && highlights.length >= MINIMUM_STUDENT_HIGHLIGHT_COUNT)
  }

  function activateStep(step) { setActiveStep(step) }

  function submitResponse(entry: string, promptID: string, promptText: string, attempt: number) {
    const { sessionID, } = session
    const activityUID = getUrlParam('uid', location, isTurk)
    const previousFeedback = session.submittedResponses[promptID] || [];
    // strip any HTML injected by browser extensions (such as Chrome highlight)
    const strippedEntry = stripHtml(entry);
    if (activityUID) {
      const args = {
        sessionID,
        activityUID,
        entry: strippedEntry,
        promptID,
        promptText,
        attempt,
        previousFeedback,
        callback: submitResponseCallback
      }
      dispatch(getFeedback(args))
    }
  }

  function trackPassageReadEvent() {
    const { sessionID, } = session
    const activityUID = getUrlParam('uid', location, isTurk)

    dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_PASSAGE_READ, {
      activityID: activityUID,
      sessionID: sessionID
    }));
  }

  function trackCurrentPromptStartedEvent() {

    const trackingParams = getCurrentStepDataForEventTracking(activeStep, activities, session, isTurk)
    if (!trackingParams) return; // Bail if there's no data to track

    dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_PROMPT_STARTED, trackingParams))
  }

  function trackCurrentPromptCompletedEvent() {

    const trackingParams = getCurrentStepDataForEventTracking(activeStep, activities, session, isTurk)
    if (!trackingParams) return; // Bail if there's no data to track

    dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_PROMPT_COMPLETED, trackingParams))
  }

  function trackActivityCompletedEvent() {
    const { sessionID, } = session
    const activityID = getUrlParam('uid', location, isTurk)

    dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_ACTIVITY_COMPLETED, {
      activityID,
      sessionID,
    }));

    setActivityIsComplete(true);
    defaultHandleFinishActivity()
  }

  function completeStep(stepNumber: number) {
    const newCompletedSteps = completedSteps.concat(stepNumber)
    const uniqueCompletedSteps = Array.from(new Set(newCompletedSteps))
    trackCurrentPromptCompletedEvent()
    setCompletedSteps(uniqueCompletedSteps)
  }

  function handleClick(e) {
    if (showReadTheDirectionsModal && e.target.className.indexOf('read-the-directions-modal') === -1) {
      closeReadTheDirectionsModal()
    }

    resetTimers(e)
  }

  function handleKeyDown(e) {
    if (e.key !== 'Tab' || showFocusState) { return }

    setShowFocusState(true)
  }

  function handleDoneReadingClick() {
    completeStep(READ_PASSAGE_STEP)
    const scrollContainer = document.getElementsByClassName("read-passage-container")[0]
    scrollContainer.scrollTo(0, 0)
    trackPassageReadEvent();
  }

  function onStartReadPassage(e) {
    e.stopPropagation()
    setHasStartedReadPassageStep(true)
    setShowReadTheDirectionsModal(true)
  }

  function onStartPromptSteps() { setHasStartedPromptsSteps(true) }

  function submitProblemReport(args) {
    const { sessionID, } = session
    reportAProblem({...args, sessionID})
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
    const { sessionID, submittedResponses, } = session
    const args = {
      sessionID,
      submittedResponses,
      activeStep,
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

  function scrollToQuestionSectionOnMobile() { scrollToStepOnMobile('step2')}

  function clickStepLink(stepNumber: number) {
    setActiveStep(stepNumber)
  }

  function handleHighlightKeyDown(e) {
    if (e.key !== 'Enter') { return }
    toggleStudentHighlight(e.target.textContent)
  }

  function handleHighlightClick(e) {
    toggleStudentHighlight(e.target.textContent, () => document.activeElement.blur())
  }

  function toggleStudentHighlight(text, callback=null) {
    let newHighlights = []

    if (studentHighlights.includes(text)) {
      newHighlights = studentHighlights.filter(hl => hl !== text)
    } else {
      newHighlights = studentHighlights.concat(text)
    }

    setStudentHighlights(newHighlights)
    callback && callback()
  }

  React.useEffect(() => {
    if (studentHighlights.length === 0 ) { return }
    callSaveActiveActivitySession()
  }, [studentHighlights])

  function transformMarkTags(node) {
    const strippedPassageHighlights = getStrippedPassageHighlights({ activities, session, activeStep });

    if (['p'].includes(node.name) && activeStep > 1 && strippedPassageHighlights && strippedPassageHighlights.length) {
      const stringifiedInnerElements = node.children.map(n => n.data ? n.data : n.children[0].data).join('')
      if (!stringifiedInnerElements) { return }
      const highlightIncludesElement = strippedPassageHighlights.find(ph => ph.includes(stringifiedInnerElements)) // handles case where passage highlight spans more than one paragraph
      const elementIncludesHighlight = strippedPassageHighlights.find(ph => stringifiedInnerElements.includes(ph)) // handles case where passage highlight is only part of paragraph
      if (highlightIncludesElement) {
        return <p><span className="passage-highlight">{stringifiedInnerElements}</span></p>
      }
      if (elementIncludesHighlight) {
        let newStringifiedInnerElements = stringifiedInnerElements
        strippedPassageHighlights.forEach(ph => newStringifiedInnerElements = newStringifiedInnerElements.replace(ph, `<span class="passage-highlight">${ph}</span>`))
        return <p dangerouslySetInnerHTML={{ __html: newStringifiedInnerElements }} />
      }
    }

    if (node.name === 'mark') {
      const shouldBeHighlightable = !doneHighlighting && !showReadTheDirectionsModal && hasStartedReadPassageStep
      const innerElements = node.children.map((n, i) => convertNodeToElement(n, i, transformMarkTags))
      const stringifiedInnerElements = node.children.map(n => n.data ? n.data : n.children[0].data).join('')
      let className = ''
      if(activeStep === 1) {
        className += studentHighlights.includes(stringifiedInnerElements) ? ' highlighted' : ''
      }
      className += shouldBeHighlightable  ? ' highlightable' : ''
      if (!shouldBeHighlightable) { return <mark className={className}>{innerElements}</mark>}
      /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
      return <mark className={className} onClick={handleHighlightClick} onKeyDown={handleHighlightKeyDown} role="button" tabIndex={0}>{innerElements}</mark>
    }
  }

  function handleExplanationSlideClick() {
    const nextStep = explanationSlideStep + 1;
    if (nextStep > 3) {
      setExplanationSlidesCompleted(true)
    } else {
      setExplanationSlideStep(nextStep)
    }
  }

  const { submittedResponses, sessionID, } = session;

  if (!activities.hasReceivedData) { return <LoadingSpinner /> }

  const className = `activity-container ${showFocusState ? '' : 'hide-focus-outline'} ${activeStep === READ_PASSAGE_STEP ? 'on-read-passage' : ''}`

  if(!explanationSlidesCompleted) {
    if (explanationSlideStep === 0) {
      return <WelcomeSlide onHandleClick={handleExplanationSlideClick} user={user} />
    }
    return(
      <ExplanationSlide onHandleClick={handleExplanationSlideClick} slideData={explanationData[explanationSlideStep]} />
    );
  }
  if(activityIsComplete && !window.location.href.includes('turk')) {
    return(
      <ActivityFollowUp responses={submittedResponses} saveActivitySurveyResponse={saveActivitySurveyResponse} sessionID={sessionID} user={user} />
    );
  }
  return (
    <div className={className}>
      {renderStepLinksAndDirections({
        activeStep,
        hasStartedReadPassageStep,
        hasStartedPromptSteps,
        doneHighlighting,
        showReadTheDirectionsModal,
        completedSteps,
        activities,
        clickStepLink: clickStepLink,
        scrollToQuestionSectionOnMobile: scrollToQuestionSectionOnMobile,
        closeReadTheDirectionsModal: closeReadTheDirectionsModal
      })}
      {renderReadPassageContainer({
        activities,
        activeStep,
        handleReadPassageContainerScroll,
        hasStartedPromptSteps,
        hasStartedReadPassageStep,
        scrolledToEndOfPassage,
        showReadTheDirectionsModal,
        transformMarkTags: transformMarkTags
      })}
      <RightPanel
        activateStep={activateStep}
        activeStep={activeStep}
        activities={activities}
        closeReadTheDirectionsModal={closeReadTheDirectionsModal}
        completedSteps={completedSteps}
        completeStep={completeStep}
        doneHighlighting={doneHighlighting}
        handleClickDoneHighlighting={handleClickDoneHighlighting}
        handleDoneReadingClick={handleDoneReadingClick}
        hasStartedPromptSteps={hasStartedPromptSteps}
        hasStartedReadPassageStep={hasStartedReadPassageStep}
        onStartPromptSteps={onStartPromptSteps}
        onStartReadPassage={onStartReadPassage}
        reportAProblem={submitProblemReport}
        resetTimers={resetTimers}
        scrolledToEndOfPassage={scrolledToEndOfPassage}
        session={session}
        showReadTheDirectionsModal={showReadTheDirectionsModal}
        stepsHash={refs}
        studentHighlights={studentHighlights}
        submitResponse={submitResponse}
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
