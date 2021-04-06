import * as React from "react";
import queryString from 'query-string';
import { connect } from "react-redux";

import PromptStep from './promptStep'
import StepLink from './stepLink'

import LoadingSpinner from '../shared/loadingSpinner'
import { getActivity } from "../../actions/activities";
import { TrackAnalyticsEvent } from "../../actions/analytics";
import { Events } from '../../modules/analytics'
import { getFeedback, saveActiveActivitySession, setSessionId } from '../../actions/session'
import { ActivitiesReducerState } from '../../reducers/activitiesReducer'
import { SessionReducerState } from '../../reducers/sessionReducer'
import getParameterByName from '../../helpers/getParameterByName';
import { Passage } from '../../interfaces/activities'
import { postTurkSession } from '../../utils/turkAPI';
import { getCsrfToken } from "../../../Staff/helpers/comprehension";

const bigCheckSrc =  `${process.env.CDN_URL}/images/icons/check-circle-big.svg`
const tadaSrc =  `${process.env.CDN_URL}/images/illustrations/tada.svg`

interface StudentViewContainerProps {
  dispatch: Function;
  activities: ActivitiesReducerState;
  session: SessionReducerState;
  location?: any;
  handleFinishActivity?: () => void;
  isTurk?: boolean;
}

interface StudentViewContainerState {
  activeStep?: number;
  completedSteps: Array<number>;
  showFocusState: boolean;
}

const READ_PASSAGE_STEP = 1
const ALL_STEPS = [READ_PASSAGE_STEP, 2, 3, 4]

export class StudentViewContainer extends React.Component<StudentViewContainerProps, StudentViewContainerState> {
  private step1: any // eslint-disable-line react/sort-comp
  private step2: any // eslint-disable-line react/sort-comp
  private step3: any // eslint-disable-line react/sort-comp
  private step4: any // eslint-disable-line react/sort-comp

  constructor(props: StudentViewContainerProps) {
    super(props)

    this.state = {
      activeStep: READ_PASSAGE_STEP,
      completedSteps: [],
      showFocusState: false
    }

    this.step1 = React.createRef()
    this.step2 = React.createRef()
    this.step3 = React.createRef()
    this.step4 = React.createRef()

    const csrfToken = getCsrfToken();
    localStorage.setItem('csrfToken', csrfToken);
  }

  componentDidMount() {
    const { dispatch, session, isTurk } = this.props
    const sessionFromUrl = this.specifiedActivitySessionUID()
    if (sessionFromUrl) {
      dispatch(setSessionId(sessionFromUrl));
    }
    const { sessionID, } = session
    const activityUID = this.activityUID()

    if (activityUID) {
      dispatch(getActivity(sessionID, activityUID))
      isTurk && this.handlePostTurkSession(sessionID);
    }

    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  handlePostTurkSession = (activitySessionId: string) => {
    const turkingRoundID = getParameterByName('id', window.location.href);
    postTurkSession(turkingRoundID, activitySessionId).then(response => {
      const { error } = response;
      if(error) {
        alert(`${error}`);
      }
    });
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

  submitResponse = (entry: string, promptID: string, promptText: string, attempt: number) => {
    const { dispatch, session, } = this.props
    const { sessionID, } = session
    const activityUID = this.activityUID()
    const previousFeedback = session.submittedResponses[promptID] || [];
    if (activityUID) {
      const args = {
        sessionID,
        activityUID,
        entry,
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
    }))
    if(isTurk) {
      handleFinishActivity();
    }
  }

  activateStep = (step?: number, callback?: Function) => {
    const { activeStep, completedSteps, } = this.state
    // don't activate a step if it's already active
    if (activeStep == step) return
    // don't activate steps before Done reading button has been clicked
    if (step && step > 1 && !completedSteps.includes(READ_PASSAGE_STEP)) return
    this.setState({ activeStep: step, }, () => {
      this.trackCurrentPromptStartedEvent()
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

  handleKeyDown = (e) => {
    const { showFocusState, } = this.state

    if (e.key !== 'Tab' || showFocusState) { return }

    this.setState({ showFocusState: true })
  }

  handleDoneReadingClick = () => {
    this.completeStep(READ_PASSAGE_STEP);
    this.trackPassageReadEvent();
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

  submitResponseCallback = () => {
    const { dispatch, session, } = this.props
    const { sessionID, submittedResponses, } = session
    const { activeStep, completedSteps, } = this.state
    const args = {
      sessionID,
      submittedResponses,
      activeStep,
      completedSteps,
    }
    dispatch(saveActiveActivitySession(args))
    this.scrollToHighlight()
  }

  scrollToStepOnMobile = (ref: string) => {
    this[ref].scrollIntoView(false)
  }

  clickStepLink = (stepNumber: number) => {
    this.activateStep(stepNumber)
    this.scrollToStepOnMobile(`step${stepNumber}`)
  }

  addPTagsToPassages = (passages: Passage[]) => {
    return passages.map(passage => {
      const { text } = passage;
      const paragraphArray = text ? text.match(/[^\r\n]+/g) : [];
      return paragraphArray.map(p => `<p>${p}</p>`).join('')
    })
  }

  formatHtmlForPassage = () => {
    const { activeStep, } = this.state
    const { activities, session, } = this.props
    const { currentActivity, } = activities

    if (!currentActivity) { return }

    let passages: any[] = currentActivity.passages
    const passagesWithPTags = this.addPTagsToPassages(passages)

    if (!activeStep || activeStep === READ_PASSAGE_STEP) { return passagesWithPTags }

    const promptIndex = activeStep - 2 // have to subtract 2 because the prompts array index starts at 0 but the prompt numbers in the state are 2..4
    const activePromptId = currentActivity.prompts[promptIndex].id
    const submittedResponsesForActivePrompt = session.submittedResponses[activePromptId]

    if (!(submittedResponsesForActivePrompt && submittedResponsesForActivePrompt.length)) { return passagesWithPTags }

    const lastSubmittedResponse = submittedResponsesForActivePrompt[submittedResponsesForActivePrompt.length - 1]

    if (!lastSubmittedResponse.highlight) { return passagesWithPTags }

    const passageHighlights = lastSubmittedResponse.highlight.filter(hl => hl.type === "passage")

    passageHighlights.forEach(hl => {
      const characterStart = hl.character || 0
      passages = passages.map((passage: Passage) => {
        let formattedPassage = passage;
        const { text } = passage;
        const passageBeforeCharacterStart = text.substring(0, characterStart)
        const passageAfterCharacterStart = text.substring(characterStart)
        const highlightedPassageAfterCharacterStart = passageAfterCharacterStart.replace(hl.text, `<span class="passage-highlight">${hl.text}</span>`)
        formattedPassage.text = `${passageBeforeCharacterStart}${highlightedPassageAfterCharacterStart}`
        return formattedPassage
      })
    })

    return this.addPTagsToPassages(passages)
  }

  renderStepLinks = () => {
    const { activities, } = this.props
    const { currentActivity, } = activities
    if (!currentActivity) return

    const links = []
    const numberOfLinks = ALL_STEPS.length

    // starting at 2 because we don't want to include the read passage step
    for (let i=2; i <= numberOfLinks; i++ ) {
      links.push(<StepLink clickStepLink={this.clickStepLink} index={i} renderStepNumber={this.renderStepNumber} />)
    }

    return (<div className="hide-on-desktop step-links">
      {links}
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
      <h2>Read the passage</h2>
      <button className='quill-button large primary contained done-reading-button' onClick={this.handleDoneReadingClick} type="button">Done reading</button>
    </div>)
  }

  renderPromptSteps = () => {
    const { activities, session, } = this.props
    const { activeStep, completedSteps } = this.state
    const { currentActivity, } = activities
    const { submittedResponses, } = session
    if (!currentActivity) return

    const steps =  currentActivity.prompts.map((prompt, i) => {
      // using i + 2 because the READ_PASSAGE_STEP is 1, so the first item in the set of prompts will always be 2
      const stepNumber = i + 2
      const everyOtherStepCompleted = completedSteps.filter(s => s !== stepNumber).length === 3
      return (<PromptStep
        activateStep={this.activateStep}
        active={stepNumber === activeStep}
        className={`step ${activeStep === stepNumber ? 'active' : ''}`}
        completeStep={this.completeStep}
        everyOtherStepCompleted={everyOtherStepCompleted}
        key={stepNumber}
        passedRef={(node: JSX.Element) => this[`step${stepNumber}`] = node} // eslint-disable-line react/jsx-no-bind
        prompt={prompt}
        stepNumber={stepNumber}
        stepNumberComponent={this.renderStepNumber(stepNumber)}
        submitResponse={this.submitResponse}
        submittedResponses={submittedResponses[prompt.id] || []}
      />)
    })

    const headerCopy = activeStep === READ_PASSAGE_STEP ? 'Then, complete these sentences' : 'Complete these sentences'

    return (<div>
      <h2>{headerCopy}</h2>
      {steps}
    </div>)
  }

  renderReadPassageContainer = () => {
    const { activities, } = this.props
    const { currentActivity, } = activities
    if (!currentActivity) { return }

    const { title, passages, } = currentActivity

    const headerImage = passages[0].image_link && <img alt={passages[0].image_alt_text} className="header-image" src={passages[0].image_link} />

    return (<div className="read-passage-container">
      <div>
        <p className="directions">Read the passage.</p>
        <h1 className="title">{currentActivity.title}</h1>
        {headerImage}
        <div className="passage" dangerouslySetInnerHTML={{__html: this.formatHtmlForPassage()}} />
      </div>
    </div>)
  }

  renderSteps = () => {
    return (<div className="steps-outer-container">
      <div className="steps-inner-container">
        {this.renderReadPassageStep()}
        {this.renderPromptSteps()}
      </div>
    </div>)
  }

  renderCompletedView() {
    return (<div className="activity-completed">
      <img alt="Party hat with confetti coming out" src={tadaSrc} />
      <h1>Activity Complete!</h1>
      <p>Thank you for taking the time to try our newest tool, Quill Comprehension.</p>
    </div>)
  }

  render() {
    const { activities, } = this.props
    const { showFocusState, completedSteps, } = this.state

    if (!activities.hasReceivedData) { return <LoadingSpinner /> }

    if (completedSteps.length === ALL_STEPS.length) { return this.renderCompletedView() }

    const className = `activity-container ${showFocusState ? '' : 'hide-focus-outline'}`

    return (<div className={className}>
      {this.renderStepLinks()}
      {this.renderReadPassageContainer()}
      {this.renderSteps()}
    </div>)
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
