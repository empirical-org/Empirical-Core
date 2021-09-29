import * as React from "react";
import { connect } from "react-redux";
import stripHtml from "string-strip-html";
import { convertNodeToElement } from 'react-html-parser'

import RightPanel from './rightPanel'

import { explanationData } from "../activitySlides/explanationData";
import ExplanationSlide from "../activitySlides/explanationSlide";
import WelcomeSlide from "../activitySlides/welcomeSlide";
import ActivityFollowUp from './activityFollowUp';
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
import { roundMillisecondsToSeconds, KEYDOWN, MOUSEMOVE, MOUSEDOWN, CLICK, KEYPRESS, VISIBILITYCHANGE } from '../../../Shared/index'

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
    const { dispatch, session, isTurk, location } = this.props
    const activityUID = getUrlParam('uid', location, isTurk)
    const sessionFromUrl = getUrlParam('session', location, isTurk)
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
    const { activeStep, completedSteps} = this.state
    const { session, activities, } = this.props
    const { submittedResponses, } = session

    if (activities.currentActivity) { document.title = `Quill.org | ${activities.currentActivity.title}`}

    if (submittedResponses === prevProps.session.submittedResponses) { return }

    if (!outOfAttemptsForActivePrompt(activeStep, session, activities)) { return }

    if (!everyOtherStepCompleted(activeStep, completedSteps)) { return }

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

  resetTimers = (e=null) => {
    const now = Date.now()
    this.setState((prevState, props) => {
      const { session, activities } = props;
      const { activeStep, startTime, timeTracking, isIdle, inactivityTimer, completedSteps, explanationSlidesCompleted, hasStartedPromptSteps, } = prevState
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
    const { dispatch, session, isTurk, location } = this.props
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
        callback: this.submitResponseCallback
      }
      dispatch(getFeedback(args))
    }
  }

  trackPassageReadEvent = () => {
    const { dispatch, isTurk, location } = this.props
    const { session, } = this.props
    const { sessionID, } = session
    const activityUID = getUrlParam('uid', location, isTurk)

    dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_PASSAGE_READ, {
      activityID: activityUID,
      sessionID: sessionID
    }));
  }

  trackCurrentPromptStartedEvent = () => {
    const { activeStep } = this.state
    const { dispatch, activities, session, isTurk } = this.props

    const trackingParams = getCurrentStepDataForEventTracking(activeStep, activities, session, isTurk)
    if (!trackingParams) return; // Bail if there's no data to track

    dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_PROMPT_STARTED, trackingParams))
  }

  trackCurrentPromptCompletedEvent = () => {
    const { activeStep } = this.state
    const { dispatch, activities, session, isTurk } = this.props

    const trackingParams = getCurrentStepDataForEventTracking(activeStep, activities, session, isTurk)
    if (!trackingParams) return; // Bail if there's no data to track

    dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_PROMPT_COMPLETED, trackingParams))
  }

  trackActivityCompletedEvent = () => {
    const { dispatch, isTurk, location } = this.props
    const { session, } = this.props
    const { sessionID, } = session
    const activityID = getUrlParam('uid', location, isTurk)

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

  reportAProblem = (args) => {
    const { session, } = this.props
    const { sessionID, } = session
    reportAProblem({...args, sessionID})
  }

  handleClickDoneHighlighting = () => {
    this.setState({ doneHighlighting: true}, () => {
      if (onMobile()) { window.scrollTo(0, 0) }
    })
  }

  scrollToStep = (ref: string) => {
    if (onMobile()) {
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

    if (onMobile()) {
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
    const { activities, session } = this.props;
    const { studentHighlights, showReadTheDirectionsModal, doneHighlighting, hasStartedReadPassageStep, activeStep } = this.state
    const strippedPassageHighlights = getStrippedPassageHighlights({ activities, session, activeStep });

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
    if(node.name === 'p' && activeStep > 1 && strippedPassageHighlights) {
      const stringifiedInnerElements = node.children.map(n => n.data ? n.data : n.children[0].data).join('')
      if(stringifiedInnerElements && strippedPassageHighlights.includes(stringifiedInnerElements)) {
        return <p><span className="passage-highlight">{stringifiedInnerElements}</span></p>
      }
    }
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
    const { submittedResponses, sessionID, } = session;
    const { showFocusState, activeStep, activityIsComplete, explanationSlidesCompleted, explanationSlideStep, hasStartedPromptSteps, hasStartedReadPassageStep, doneHighlighting, showReadTheDirectionsModal, completedSteps, scrolledToEndOfPassage, studentHighlights } = this.state
    const stepsHash = {
      'step1': (node: JSX.Element) => this.step1 = node,
      'step2': (node: JSX.Element) => this.step2 = node,
      'step3': (node: JSX.Element) => this.step3 = node,
      'step4': (node: JSX.Element) => this.step4 = node,
    }

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
        <ActivityFollowUp responses={submittedResponses} saveActivitySurveyResponse={saveActivitySurveyResponse} sessionID={sessionID} user={user} />
      );
    }
    return (
      <div className={className} onTouchEnd={this.handleReadPassageContainerTouchMoveEnd}>
        {renderStepLinksAndDirections({
          activeStep,
          hasStartedReadPassageStep,
          hasStartedPromptSteps,
          doneHighlighting,
          showReadTheDirectionsModal,
          completedSteps,
          activities,
          clickStepLink: this.clickStepLink,
          scrollToQuestionSectionOnMobile: this.scrollToQuestionSectionOnMobile,
          closeReadTheDirectionsModal: this.closeReadTheDirectionsModal
        })}
        {renderReadPassageContainer({
          activities,
          activeStep,
          handleReadPassageContainerScroll: this.handleReadPassageContainerScroll,
          hasStartedPromptSteps,
          hasStartedReadPassageStep,
          scrolledToEndOfPassage,
          showReadTheDirectionsModal,
          transformMarkTags: this.transformMarkTags
        })}
        <RightPanel
          activateStep={this.activateStep}
          activeStep={activeStep}
          activities={activities}
          closeReadTheDirectionsModal={this.closeReadTheDirectionsModal}
          completedSteps={completedSteps}
          completeStep={this.completeStep}
          doneHighlighting={doneHighlighting}
          handleClickDoneHighlighting={this.handleClickDoneHighlighting}
          handleDoneReadingClick={this.handleDoneReadingClick}
          hasStartedPromptSteps={hasStartedPromptSteps}
          hasStartedReadPassageStep={hasStartedReadPassageStep}
          onStartPromptSteps={this.onStartPromptSteps}
          onStartReadPassage={this.onStartReadPassage}
          reportAProblem={this.reportAProblem}
          resetTimers={this.resetTimers}
          scrolledToEndOfPassage={scrolledToEndOfPassage}
          session={session}
          showReadTheDirectionsModal={showReadTheDirectionsModal}
          stepsHash={stepsHash}
          studentHighlights={studentHighlights}
          submitResponse={this.submitResponse}
          toggleStudentHighlight={this.toggleStudentHighlight}
        />
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
