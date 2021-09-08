import * as React from "react";
import queryString from 'query-string';
import { connect } from "react-redux";
import stripHtml from "string-strip-html";
import ReactHtmlParser, { convertNodeToElement, } from 'react-html-parser'

import PromptStep from './promptStep'
import StepLink from './stepLink'
import ReadAndHighlightInstructions from './readAndHighlightInstructions'
import DirectionsSectionAndModal from './directionsSectionAndModal'
import BottomNavigation from './bottomNavigation'
import StepOverview from './stepOverview'
import HeaderImage from './headerImage'

import { explanationData } from "../activitySlides/explanationData";
import ExplanationSlide from "../activitySlides/explanationSlide";
import WelcomeSlide from "../activitySlides/welcomeSlide";
import PostActivitySlide from '../activitySlides/postActivitySlide';
import LoadingSpinner from '../shared/loadingSpinner'
import { getActivity } from "../../actions/activities";
import { TrackAnalyticsEvent } from "../../actions/analytics";
import { Events } from '../../modules/analytics'
import { completeActivitySession,
         fetchActiveActivitySession,
         getFeedback,
         processUnfetchableSession,
         saveActiveActivitySession } from '../../actions/session'
import { generateConceptResults, } from '../../libs/conceptResults'
import { ActivitiesReducerState } from '../../reducers/activitiesReducer'
import { SessionReducerState } from '../../reducers/sessionReducer'
import getParameterByName from '../../helpers/getParameterByName';
import { Passage } from '../../interfaces/activities'
import { postTurkSession } from '../../utils/turkAPI';
import {
  roundMillisecondsToSeconds,
  KEYDOWN,
  MOUSEMOVE,
  MOUSEDOWN,
  CLICK,
  KEYPRESS,
  VISIBILITYCHANGE
} from '../../../Shared/index'

const bigCheckSrc =  `${process.env.CDN_URL}/images/icons/check-circle-big.svg`
const tadaSrc =  `${process.env.CDN_URL}/images/illustrations/tada.svg`

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

export class StudentViewContainer extends React.Component<StudentViewContainerProps, StudentViewContainerState> {
  private step1: any // eslint-disable-line react/sort-comp
  private step2: any // eslint-disable-line react/sort-comp
  private step3: any // eslint-disable-line react/sort-comp
  private step4: any // eslint-disable-line react/sort-comp

  constructor(props: StudentViewContainerProps) {
    super(props)

    const shouldSkipToPrompts = window.location.href.includes('turk') || window.location.href.includes('skipToPrompts')

    this.state = {
      activeStep: shouldSkipToPrompts ? READ_PASSAGE_STEP + 1: READ_PASSAGE_STEP,
      activityIsComplete: false,
      activityIsReadyForSubmission: false,
      explanationSlidesCompleted: shouldSkipToPrompts,
      explanationSlideStep: 0,
      completedSteps: shouldSkipToPrompts ? [READ_PASSAGE_STEP] : [],
      showFocusState: false,
      startTime: Date.now(),
      isIdle: false,
      studentHighlights: [],
      scrolledToEndOfPassage: shouldSkipToPrompts,
      showReadTheDirectionsModal: false,
      hasStartedReadPassageStep: shouldSkipToPrompts,
      hasStartedPromptSteps: shouldSkipToPrompts,
      doneHighlighting: shouldSkipToPrompts,
      timeTracking: {
        [ONBOARDING]: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0
      }
    }

    this.step1 = React.createRef()
    this.step2 = React.createRef()
    this.step3 = React.createRef()
    this.step4 = React.createRef()
  }

  componentDidMount() {
    const { dispatch, session, isTurk } = this.props
    const activityUID = this.activityUID()
    const sessionFromUrl = this.specifiedActivitySessionUID()
    if (sessionFromUrl) {
      const fetchActiveActivitySessionArgs = {
        sessionID: sessionFromUrl,
        activityUID: activityUID,
        callback: this.loadPreviousSession
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
        isTurk && this.handlePostTurkSession(sessionID);
      }
    }

    window.addEventListener(KEYDOWN, this.handleKeyDown)
    window.addEventListener(MOUSEMOVE, this.resetTimers)
    window.addEventListener(MOUSEDOWN, this.resetTimers)
    window.addEventListener(CLICK, this.handleClick)
    window.addEventListener(KEYPRESS, this.resetTimers)
    window.addEventListener(VISIBILITYCHANGE, this.setIdle)
  }

  componentWillUnmount() {
    window.removeEventListener(KEYDOWN, this.handleKeyDown)
    window.removeEventListener(MOUSEMOVE, this.resetTimers)
    window.removeEventListener(MOUSEDOWN, this.resetTimers)
    window.removeEventListener(CLICK, this.handleClick)
    window.removeEventListener(KEYPRESS, this.resetTimers)
    window.removeEventListener(VISIBILITYCHANGE, this.setIdle)
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeStep, } = this.state
    const { session, activities, } = this.props
    const { submittedResponses, } = session

    if (activities.currentActivity) { document.title = `Quill.org | ${activities.currentActivity.title}`}

    if (submittedResponses === prevProps.session.submittedResponses) { return }

    if (!this.outOfAttemptsForActivePrompt()) { return }

    if (!this.everyOtherStepCompleted(activeStep)) { return }

    this.completeStep(activeStep)
  }

  handleReadPassageContainerTouchMoveEnd = (e) => {
    setTimeout(() => this.handleReadPassageContainerScroll(e), 300)
  }

  handleReadPassageContainerScroll = (e=null) => {
    const el = document.getElementById('end-of-passage')
    if (!el) { return }
    const rect = el.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    if (!(rect.bottom < 100 || rect.top - viewHeight >= 100)) {
      this.setState({ scrolledToEndOfPassage: true, })
    }
    if (e) { this.resetTimers(e) }
  }

  closeReadTheDirectionsModal = () => this.setState({ showReadTheDirectionsModal: false, })

  outOfAttemptsForActivePrompt = () => {
    const { activeStep, } = this.state
    const { session, } = this.props
    const { submittedResponses, } = session
    const activePrompt = this.orderedSteps()[activeStep - 2] // subtracting 2 because the READ_PASSAGE_STEP is 1, so the first item in the set of prompts will always be 2

    if (!activePrompt) { return }

    const responsesForPrompt = submittedResponses[activePrompt.id]

    if (!responsesForPrompt) { return }

    const lastAttempt = responsesForPrompt[responsesForPrompt.length - 1]

    return (responsesForPrompt.length === activePrompt.max_attempts) || lastAttempt.optimal
  }

  resetTimers = (e=null) => {
    const now = Date.now()
    this.setState((prevState, props) => {
      const { activeStep, startTime, timeTracking, isIdle, inactivityTimer, completedSteps, explanationSlidesCompleted, hasStartedPromptSteps, } = prevState
      if (completedSteps.includes(activeStep)) { return } // don't want to add time if a user is revisiting a previously completed step
      if (this.outOfAttemptsForActivePrompt()) { return } // or if they are finished submitting responses for the current active step
      if (activeStep > READ_PASSAGE_STEP && !hasStartedPromptSteps) { return } // or if they are between the read passage step and starting the prompts

      if (inactivityTimer) { clearTimeout(inactivityTimer) }

      let elapsedTime = now - startTime
      if (isIdle) {
        elapsedTime = 0
      }

      const activeStepKey = explanationSlidesCompleted ? activeStep : ONBOARDING
      const newTimeTracking = {...timeTracking, [activeStepKey]: timeTracking[activeStepKey] + elapsedTime}
      const newInactivityTimer = setTimeout(this.setIdle, 30000);  // time is in milliseconds (1000 is 1 second)

      return { timeTracking: newTimeTracking, isIdle: false, inactivityTimer: newInactivityTimer, startTime: now, }
    })

    return Promise.resolve(true);
  }

  setIdle = () => { this.resetTimers().then(() => this.setState({ isIdle: true })) }

  handlePostTurkSession = (activitySessionId: string) => {
    const turkingRoundID = getParameterByName('id', window.location.href);
    postTurkSession(turkingRoundID, activitySessionId).then(response => {
      const { error } = response;
      if(error) {
        alert(`${error}`);
      }
    });
  }

  defaultHandleFinishActivity = () => {
    const { timeTracking, studentHighlights, } = this.state
    const { activities, dispatch, session, handleFinishActivity, } = this.props
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

  onMobile = () => window.innerWidth < 1100

  getUrlParam = (paramName: string) => {
    const { location, isTurk } = this.props
    if(isTurk) {
      return getParameterByName(paramName, window.location.href)
    }
    const { search, } = location
    if (!search) { return }
    return queryString.parse(search)[paramName]
  }

  activityUID = () => {
    return this.getUrlParam('uid')
  }

  specifiedActivitySessionUID = () => {
    return this.getUrlParam('session')
  }

  loadPreviousSession = (data: object) => {
    const {
      activeStep,
      completedSteps,
      timeTracking,
      studentHighlights,
    } = this.state

    const highlights = data.studentHighlights || studentHighlights
    // if the student hasn't gotten to the highlighting stage yet,
    // we don't want them to skip seeing the directions modal and reading the passage again
    const studentHasAtLeastStartedHighlighting = highlights && highlights.length

    const newState = {
      activeStep: data.activeStep || activeStep,
      completedSteps: data.completedSteps || completedSteps,
      timeTracking: data.timeTracking || timeTracking,
      studentHighlights: highlights,
      hasStartedReadPassageStep: studentHasAtLeastStartedHighlighting,
      scrolledToEndOfPassage: studentHasAtLeastStartedHighlighting,
      doneHighlighting: studentHasAtLeastStartedHighlighting && highlights.length >= MINIMUM_STUDENT_HIGHLIGHT_COUNT
    }

    this.setState(newState, () => {
      const { activeStep, } = this.state
      this.activateStep(activeStep, null, true)
    })
  }

  submitResponse = (entry: string, promptID: string, promptText: string, attempt: number) => {
    const { dispatch, session, } = this.props
    const { sessionID, } = session
    const activityUID = this.activityUID()
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
        callback: this.submitResponseCallback
      }
      dispatch(getFeedback(args))
    }
  }

  getCurrentStepDataForEventTracking = () => {
    const { activities, session, } = this.props
    const { currentActivity, } = activities
    const { sessionID, } = session
    const activityID = this.activityUID()
    const { activeStep, } = this.state
    const promptIndex = activeStep - 2 // have to subtract 2 because the prompts array index starts at 0 but the prompt numbers in the state are 2..4

    if (promptIndex < 0 || !currentActivity.prompts[promptIndex]) return; // If we're on a step earlier than a prompt, or there's no prompt for this step then there's nothing to track

    const promptID = currentActivity.prompts[promptIndex].id

    return {
      activityID,
      sessionID,
      promptID,
    }
  }

  trackPassageReadEvent = () => {
    const { dispatch, } = this.props
    const { session, } = this.props
    const { sessionID, } = session
    const activityUID = this.activityUID()

    dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_PASSAGE_READ, {
      activityID: activityUID,
      sessionID: sessionID
    }));
  }

  trackCurrentPromptStartedEvent = () => {
    const { dispatch, } = this.props

    const trackingParams = this.getCurrentStepDataForEventTracking()
    if (!trackingParams) return; // Bail if there's no data to track

    dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_PROMPT_STARTED, trackingParams))
  }

  trackCurrentPromptCompletedEvent = () => {
    const { dispatch, } = this.props

    const trackingParams = this.getCurrentStepDataForEventTracking()
    if (!trackingParams) return; // Bail if there's no data to track

    dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_PROMPT_COMPLETED, trackingParams))
  }

  trackActivityCompletedEvent = () => {
    const { dispatch, isTurk, handleFinishActivity } = this.props
    const { session, } = this.props
    const { sessionID, } = session
    const activityID = this.activityUID()

    dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_ACTIVITY_COMPLETED, {
      activityID,
      sessionID,
    }));

    this.setState({ activityIsComplete: true });
    this.defaultHandleFinishActivity()
  }

  activateStep = (step?: number, callback?: Function, skipTracking?: boolean) => {
    const { activeStep, completedSteps, } = this.state
    // don't activate a step if it's already active
    if (activeStep == step) return
    // don't activate steps before Done reading button has been clicked
    if (step && step > 1 && !completedSteps.includes(READ_PASSAGE_STEP)) return

    this.setState({ activeStep: step, startTime: Date.now(), }, () => {
      if (!skipTracking) this.trackCurrentPromptStartedEvent()
      if (callback) { callback() }
    })
  }

  completeStep = (stepNumber: number) => {
    const { completedSteps, } = this.state
    const newCompletedSteps = completedSteps.concat(stepNumber)
    const uniqueCompletedSteps = Array.from(new Set(newCompletedSteps))
    this.trackCurrentPromptCompletedEvent()
    this.setState({ completedSteps: uniqueCompletedSteps }, () => {
      let nextStep: number|undefined = stepNumber + 1
      if (nextStep > ALL_STEPS.length || uniqueCompletedSteps.includes(nextStep)) {
        nextStep = ALL_STEPS.find(s => !uniqueCompletedSteps.includes(s))
      }

      if (nextStep) {
        this.activateStep(nextStep, () => stepNumber !== READ_PASSAGE_STEP ? this.scrollToStep(`step${nextStep}`) : null)
      } else {
        this.trackActivityCompletedEvent(); // If there is no next step, the activity is done
      }
    })
  }

  handleClick = (e) => {
    const { showReadTheDirectionsModal, } = this.state
    if (showReadTheDirectionsModal && e.target.className.indexOf('read-the-directions-modal') === -1) {
      this.closeReadTheDirectionsModal()
    }

    this.resetTimers(e)
  }

  handleKeyDown = (e) => {
    const { showFocusState, } = this.state

    if (e.key !== 'Tab' || showFocusState) { return }

    this.setState({ showFocusState: true })
  }

  handleDoneReadingClick = () => {
    this.completeStep(READ_PASSAGE_STEP)
    const scrollContainer = document.getElementsByClassName("read-passage-container")[0]
    scrollContainer.scrollTo(0, 0)
    this.trackPassageReadEvent();
  }

  onStartReadPassage = (e) => {
    e.stopPropagation()
    this.setState({ hasStartedReadPassageStep: true, showReadTheDirectionsModal: true, })
  }

  onStartPromptSteps = () => this.setState({ hasStartedPromptSteps: true, })

  handleClickDoneHighlighting = () => {
    this.setState({ doneHighlighting: true}, () => {
      if (this.onMobile()) { window.scrollTo(0, 0) }
    })
  }

  scrollToStep = (ref: string) => {
    if (this.onMobile()) {
      this.scrollToStepOnMobile(ref)
    } else {
      const scrollContainer = document.getElementsByClassName("steps-outer-container")[0]
      const el = this[ref]

      scrollContainer.scrollTo(0, el.offsetTop - 34)
    }
  }

  scrollToHighlight = () => {
    const passageHighlights = document.getElementsByClassName('passage-highlight')
    if (!passageHighlights.length) { return }

    const el = passageHighlights[0].parentElement

    // we want to scroll 24px above the top of the paragraph, but we have to use 84 because of the 60px padding set at the top of the activity-container element
    const additionalTopOffset = 84

    if (this.onMobile()) {
      el.scrollIntoView(true)
      window.scrollBy(0, -additionalTopOffset)
    } else {
      const scrollContainer = document.getElementsByClassName("read-passage-container")[0]
      scrollContainer.scrollTo(0, el.offsetTop - additionalTopOffset)
    }
  }

  saveActiveActivitySession = () => {
    const { dispatch, session, } = this.props
    const { sessionID, submittedResponses, } = session
    const { activeStep, completedSteps, timeTracking, studentHighlights, } = this.state
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

  submitResponseCallback = () => {
    this.saveActiveActivitySession()
    this.scrollToHighlight()
  }

  scrollToStepOnMobile = (ref: string) => {
    this[ref].scrollIntoView(false)
  }

  scrollToQuestionSectionOnMobile = () => this.scrollToStepOnMobile('step2')

  clickStepLink = (stepNumber: number) => {
    this.activateStep(stepNumber)
    this.scrollToStepOnMobile(`step${stepNumber}`)
  }

  addPTagsToPassages = (passages: Passage[]) => {
    const { studentHighlights, scrolledToEndOfPassage, } = this.state
    return passages.map(passage => {
      const { text } = passage;
      const paragraphArray = text ? text.match(/[^\r\n]+/g) : [];
      return paragraphArray.map((p, i) => {
        if (i === paragraphArray.length - 1 && !scrolledToEndOfPassage) {
          return `<p>${p}<span id="end-of-passage"></span></p>`
        }
        return `<p>${p}</p>`
      }).join('').replace('<p><p>', '<p>').replace('</p></p>', '</p>')
    })
  }

  orderedSteps = () => {
    const { activities, } = this.props
    const { currentActivity, } = activities

    return currentActivity ? currentActivity.prompts.sort((a, b) => a.conjunction.localeCompare(b.conjunction)) : [];
  }

  removeElementsFromPassages = (passages, element) => {
    return passages.map(passage => {
      return stripHtml(passage, { onlyStripTags: [element] })
    })
  }

  handleHighlightKeyDown = (e) => {
    if (e.key !== 'Enter') { return }
    this.toggleStudentHighlight(e.target.textContent)
  }

  handleHighlightClick = (e) => this.toggleStudentHighlight(e.target.textContent, () => document.activeElement.blur())

  toggleStudentHighlight = (text, callback=null) => {
    const { studentHighlights, } = this.state

    let newHighlights = []

    if (studentHighlights.includes(text)) {
      newHighlights = studentHighlights.filter(hl => hl !== text)
    } else {
      newHighlights = studentHighlights.concat(text)
    }

    this.setState({ studentHighlights: newHighlights, }, () => {
      callback && callback()
      this.saveActiveActivitySession()
    })
  }

  transformMarkTags = (node) => {
    const { studentHighlights, showReadTheDirectionsModal, doneHighlighting, hasStartedReadPassageStep, } = this.state
    if (node.name === 'mark') {
      const shouldBeHighlightable = !doneHighlighting && !showReadTheDirectionsModal && hasStartedReadPassageStep
      const innerElements = node.children.map((n, i) => convertNodeToElement(n, i, this.transformMarkTags))
      const stringifiedInnerElements = node.children.map(n => n.data ? n.data : n.children[0].data).join('')
      let className = ''
      className += studentHighlights.includes(stringifiedInnerElements) ? ' highlighted' : ''
      className += shouldBeHighlightable  ? ' highlightable' : ''
      if (!shouldBeHighlightable) { return <mark className={className}>{innerElements}</mark>}
      return <mark className={className} onClick={this.handleHighlightClick} onKeyDown={this.handleHighlightKeyDown} role="button" tabIndex={0}>{innerElements}</mark>
    }
  }

  formatHtmlForPassage = () => {
    const { activeStep, studentHighlights, } = this.state
    const { activities, session, } = this.props
    const { currentActivity, } = activities

    if (!currentActivity) { return }

    let passages: any[] = currentActivity.passages
    const passagesWithPTags = this.addPTagsToPassages(passages)
    const passagesWithoutSpanTags = this.removeElementsFromPassages(passagesWithPTags, 'span');

    if (!activeStep || activeStep === READ_PASSAGE_STEP) { return passagesWithPTags }

    const promptIndex = activeStep - 2 // have to subtract 2 because the prompts array index starts at 0 but the prompt numbers in the state are 2..4
    const activePromptId = currentActivity.prompts[promptIndex].id
    const submittedResponsesForActivePrompt = session.submittedResponses[activePromptId]

    // we return the unhighlighted text when an active response has no submissions with highlights
    if (!(submittedResponsesForActivePrompt && submittedResponsesForActivePrompt.length)) { return passagesWithoutSpanTags }

    const lastSubmittedResponse = submittedResponsesForActivePrompt[submittedResponsesForActivePrompt.length - 1]
    const noPassageHighlights = !lastSubmittedResponse.highlight || (lastSubmittedResponse.highlight && !lastSubmittedResponse.highlight.length);
    const isResponseHighlight = lastSubmittedResponse.highlight && lastSubmittedResponse.highlight[0] && lastSubmittedResponse.highlight[0].type === 'response';
    if (noPassageHighlights || isResponseHighlight) { return passagesWithoutSpanTags }

    const passageHighlights = lastSubmittedResponse.highlight.filter(hl => hl.type === "passage")

    passageHighlights.forEach(hl => {
      const characterStart = hl.character || 0
      passages = passages.map((passage: Passage) => {
        let formattedPassage = passage;
        const { text } = passage;
        // we want to remove any highlights returned from inactive prompts
        const formattedPassageText = stripHtml(text, { onlyStripTags: ['span', 'mark'] });
        const strippedText = stripHtml(hl.text);
        const passageBeforeCharacterStart = formattedPassageText.substring(0, characterStart)
        const passageAfterCharacterStart = formattedPassageText.substring(characterStart)
        const highlightedPassageAfterCharacterStart = passageAfterCharacterStart.replace(strippedText, `<span class="passage-highlight">${strippedText}</span>`)
        formattedPassage.text = `${passageBeforeCharacterStart}${highlightedPassageAfterCharacterStart}`
        return formattedPassage
      })
    })

    // if there were passage highlights to account for, we stripped away the student highlights and need to add them back
    studentHighlights.forEach(hl => {
      passages = passages.map((passage: Passage) => {
        let formattedPassage = passage;
        const { text } = passage;
        formattedPassage.text = text.replace(hl, `<mark class="highlighted">${hl}</mark>`)
        return formattedPassage
      })
    })

    return this.addPTagsToPassages(passages)
  }

  renderDirectionsSectionAndModal = (className) => {
    const { activeStep, doneHighlighting, showReadTheDirectionsModal, } = this.state
    const { activities, } = this.props
    const { currentActivity, } = activities

    return  (<DirectionsSectionAndModal
      activeStep={activeStep}
      className={className}
      closeReadTheDirectionsModal={this.closeReadTheDirectionsModal}
      inReflection={activeStep === READ_PASSAGE_STEP && doneHighlighting}
      passage={currentActivity.passages[0]}
      showReadTheDirectionsModal={showReadTheDirectionsModal}
    />)

  }

  renderStepLinksAndDirections = () => {
    const { activeStep, hasStartedReadPassageStep, hasStartedPromptSteps, } = this.state
    const { activities, } = this.props
    const { currentActivity, } = activities

    const directionsSectionAndModal = this.renderDirectionsSectionAndModal()

    if ((!hasStartedReadPassageStep || (activeStep > READ_PASSAGE_STEP && !hasStartedPromptSteps)) && this.onMobile()) {
      return
    }

    if (!currentActivity || activeStep === READ_PASSAGE_STEP) {
      return (<div className="hide-on-desktop step-links-and-directions-container">{directionsSectionAndModal}</div>)
    }

    const links = []
    const numberOfLinks = ALL_STEPS.length

    // starting at 2 because we don't want to include the read passage step
    for (let i=2; i <= numberOfLinks; i++ ) {
      links.push(<StepLink clickStepLink={this.clickStepLink} index={i} renderStepNumber={this.renderStepNumber} />)
    }

    return (<div className="hide-on-desktop step-links-and-directions-container">
      <div className="step-link-container">
        <div className="step-links">
          {links}
        </div>
        <button className="interactive-wrapper focus-on-light" onClick={this.scrollToQuestionSectionOnMobile} type="button">View questions</button>
      </div>
      {directionsSectionAndModal}
    </div>)
  }

  renderStepNumber = (number: number) => {
    const { activeStep, completedSteps, } = this.state
    const active = activeStep === number
    const completed = completedSteps.includes(number)
    if (completed) {
      return <img alt="white check in green circle" className="step-number completed" key={number} src={bigCheckSrc} />
    }
    // we have to remove one step for display because there are actually four steps including read passage, but it's displayed differently
    return <div className={`step-number ${active ? 'active' : ''}`} key={number}>{number - 1}</div>
  }

  renderReadPassageStep = () => {
    const { activeStep, } = this.state
    const { activities, } = this.props
    const { currentActivity, } = activities
    if (!currentActivity || activeStep !== READ_PASSAGE_STEP) { return }

    return (<div className='read-passage-step-container'>
      <h2>Read the text.</h2>
      <button className='quill-button large primary contained done-reading-button' onClick={this.handleDoneReadingClick} type="button">Done reading</button>
    </div>)
  }

  everyOtherStepCompleted = (stepNumber) => {
    const { completedSteps, } = this.state

    return completedSteps.filter(s => s !== stepNumber).length === 3
  }


  renderPromptSteps = () => {
    const { activities, session, } = this.props
    const { activeStep, completedSteps } = this.state
    const { currentActivity, } = activities
    const { submittedResponses, hasReceivedData, } = session
    if (!currentActivity || !hasReceivedData) return

    // sort by conjunctions in alphabetical order: because, but, so
    const steps =  this.orderedSteps().map((prompt, i) => {
      // using i + 2 because the READ_PASSAGE_STEP is 1, so the first item in the set of prompts will always be 2
      const stepNumber = i + 2
      const canBeClicked = completedSteps.includes(stepNumber - 1) || completedSteps.includes(stepNumber) // can click on completed steps or the one after the last completed

      return (<PromptStep
        activateStep={this.activateStep}
        active={stepNumber === activeStep}
        canBeClicked={canBeClicked}
        className={`step ${canBeClicked ? 'clickable' : ''} ${activeStep === stepNumber ? 'active' : ''}`}
        completeStep={this.completeStep}
        everyOtherStepCompleted={this.everyOtherStepCompleted(stepNumber)}
        key={stepNumber}
        passedRef={(node: JSX.Element) => this[`step${stepNumber}`] = node} // eslint-disable-line react/jsx-no-bind
        prompt={prompt}
        stepNumber={stepNumber}
        stepNumberComponent={this.renderStepNumber(stepNumber)}
        submitResponse={this.submitResponse}
        submittedResponses={(submittedResponses && submittedResponses[prompt.id]) || []}
      />)
    })

    return (<div className="prompt-steps">
      {this.renderDirectionsSectionAndModal('hide-on-mobile')}
      {steps}
    </div>)
  }

  renderReadPassageContainer = () => {
    const { showReadTheDirectionsModal, hasStartedReadPassageStep, hasStartedPromptSteps, activeStep, } = this.state
    const { activities, } = this.props
    const { currentActivity, } = activities
    if (!currentActivity) { return }

    const { title, passages, } = currentActivity

    const headerImage = passages[0].image_link && <img alt={passages[0].image_alt_text} className="header-image" src={passages[0].image_link} />
    let innerContainerClassName = "read-passage-inner-container "
    innerContainerClassName += !hasStartedReadPassageStep || showReadTheDirectionsModal || (activeStep > READ_PASSAGE_STEP && !hasStartedPromptSteps) ? 'blur' : ''

    if ((!hasStartedReadPassageStep || (activeStep > READ_PASSAGE_STEP && !hasStartedPromptSteps)) && this.onMobile()) {
      return
    }

    return (<div className="read-passage-container" onScroll={this.handleReadPassageContainerScroll}>
      <div className={innerContainerClassName}>
        <h1 className="title">{currentActivity.title}</h1>
        <HeaderImage headerImage={headerImage} passage={passages[0]} />
        <div className="passage">{ReactHtmlParser(this.formatHtmlForPassage(), { transform: this.transformMarkTags })}</div>
      </div>
    </div>)
  }

  renderSteps = () => {
    return (<div className="steps-outer-container" onScroll={this.resetTimers}>
      <div className="steps-inner-container" onScroll={this.resetTimers}>
        {this.renderReadPassageStep()}
        {this.renderPromptSteps()}
      </div>
    </div>)
  }

  renderRightPanel() {
    const { activities, } = this.props
    const { activeStep, showReadTheDirectionsModal, scrolledToEndOfPassage, studentHighlights, doneHighlighting, hasStartedReadPassageStep, hasStartedPromptSteps, } = this.state

    const bottomNavigation = (<BottomNavigation
      doneHighlighting={doneHighlighting}
      handleClickDoneHighlighting={this.handleClickDoneHighlighting}
      handleDoneReadingClick={this.handleDoneReadingClick}
      handleStartPromptStepsClick={this.onStartPromptSteps}
      handleStartReadingPassageClick={this.onStartReadPassage}
      hasStartedPromptSteps={hasStartedPromptSteps}
      hasStartedReadPassageStep={hasStartedReadPassageStep}
      inReflection={doneHighlighting && activeStep === READ_PASSAGE_STEP}
      onMobile={this.onMobile()}
      scrolledToEndOfPassage={scrolledToEndOfPassage}
      studentHighlights={studentHighlights}
    />)

    if (!hasStartedReadPassageStep) {
      return (<div className="steps-outer-container step-overview-container" onScroll={this.resetTimers}>
        <StepOverview
          activeStep={activeStep}
          handleClick={this.onStartReadPassage}
        />
        {bottomNavigation}
      </div>)
    }

    if (activeStep === READ_PASSAGE_STEP) {
      return (
        <div className="steps-outer-container" onScroll={this.resetTimers}>
          <ReadAndHighlightInstructions
            activeStep={activeStep}
            closeReadTheDirectionsModal={this.closeReadTheDirectionsModal}
            inReflection={doneHighlighting && activeStep === READ_PASSAGE_STEP}
            passage={activities.currentActivity.passages[0]}
            removeHighlight={this.toggleStudentHighlight}
            showReadTheDirectionsModal={showReadTheDirectionsModal}
            studentHighlights={studentHighlights}
          />
          {bottomNavigation}
        </div>
      )
    }

    if (!hasStartedPromptSteps) {
      return (<div className="steps-outer-container step-overview-container" onScroll={this.resetTimers}>
        <StepOverview
          activeStep={activeStep}
          handleClick={this.onStartPromptSteps}
        />
        {bottomNavigation}
      </div>)
    }

    return this.renderSteps()
  }

  handleExplanationSlideClick = () => {
    const { explanationSlideStep } = this.state;
    const nextStep = explanationSlideStep + 1;
    if(nextStep > 3) {
      this.setState({ explanationSlidesCompleted: true });
    } else {
      this.setState({  explanationSlideStep: nextStep });
    }
  }

  render = () => {
    const { activities, session, user } = this.props
    const { submittedResponses } = session;
    const { showFocusState, activeStep, activityIsComplete, explanationSlidesCompleted, explanationSlideStep } = this.state

    if (!activities.hasReceivedData) { return <LoadingSpinner /> }

    const className = `activity-container ${showFocusState ? '' : 'hide-focus-outline'} ${activeStep === READ_PASSAGE_STEP ? 'on-read-passage' : ''}`

    if(!explanationSlidesCompleted) {
      if(explanationSlideStep === 0) {
        return <WelcomeSlide onHandleClick={this.handleExplanationSlideClick} user={user} />
      }
      return(
        <ExplanationSlide onHandleClick={this.handleExplanationSlideClick} slideData={explanationData[explanationSlideStep]} />
      );
    }
    if(activityIsComplete && !window.location.href.includes('turk')) {
      return(
        <PostActivitySlide responses={submittedResponses} user={user} />
      );
    }
    return (
      <div className={className} onTouchEnd={this.handleReadPassageContainerTouchMoveEnd}>
        {this.renderStepLinksAndDirections()}
        {this.renderReadPassageContainer()}
        {this.renderRightPanel()}
      </div>
    )
  }
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
