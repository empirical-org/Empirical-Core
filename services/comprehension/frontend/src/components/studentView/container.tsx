import * as React from "react";
import {connect} from "react-redux";

import PromptStep from './promptStep'
import LoadingSpinner from '../shared/loadingSpinner'
import getParameterByName from '../../helpers/getParameterByName'
import { getActivity } from "../../actions/activities";
import { getFeedback } from '../../actions/session'
import { ActivitiesReducerState } from '../../reducers/activitiesReducer'
import { SessionReducerState } from '../../reducers/sessionReducer'

const bigCheckSrc =  `${process.env.QUILL_CDN_URL}/images/icons/check-circle-big.svg`

interface StudentViewContainerProps {
  dispatch: Function;
  activities: ActivitiesReducerState;
  session: SessionReducerState;
}

interface StudentViewContainerState {
  activeStep?: number;
  completedSteps: Array<number>;
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
      completedSteps: []
    }

    this.step1 = React.createRef()
    this.step2 = React.createRef()
    this.step3 = React.createRef()
    this.step4 = React.createRef()
  }

  componentDidMount() {
    const activityUID = this.activityUID()

    if (activityUID) {
      this.props.dispatch(getActivity(activityUID))
    }
  }

  activityUID = () => getParameterByName('uid', window.location.href)

  submitResponse = (entry: string, promptID: string) => {
    const activityUID = this.activityUID()
    if (activityUID) {
      this.props.dispatch(getFeedback(activityUID, entry, promptID))
    }
  }

  activateStep = (step?: number) => {
    // don't activate steps before Done reading button has been clicked
    if (step && step > 1 && !this.state.completedSteps.includes(READ_PASSAGE_STEP)) return
    this.setState({ activeStep: step, })
  }

  completeStep = (stepNumber: number) => {
    const { completedSteps, } = this.state
    const newCompletedSteps = completedSteps.concat(stepNumber)
    const uniqueCompletedSteps = Array.from(new Set(newCompletedSteps))
    this.setState({ completedSteps: uniqueCompletedSteps }, () => {
      let nextStep: number|undefined = stepNumber + 1
      if (nextStep > ALL_STEPS.length || uniqueCompletedSteps.includes(nextStep)) {
        nextStep = ALL_STEPS.find(s => !uniqueCompletedSteps.includes(s))
      }
      this.activateStep(nextStep)
    })
  }

  scrollToStep = (ref: string) => {
    this[ref].scrollIntoView(false)
  }

  clickStepLink = (stepNumber: number) => {
    this.activateStep(stepNumber)
    this.scrollToStep(`step${stepNumber}`)
  }

  renderStepLinks = () => {
    const { currentActivity, } = this.props.activities
    if (!currentActivity) return

    const links = []
    const numberOfLinks = ALL_STEPS.length

    for (let i=1; i <= numberOfLinks; i++ ) {
      links.push(<div onClick={() => this.clickStepLink(i)}>{this.renderStepNumber(i)}</div>)
    }

    return (<div className="hide-on-desktop step-links">
      {links}
    </div>)
  }

  renderStepNumber(number: number) {
    const { activeStep, completedSteps, } = this.state
    const active = activeStep === number
    const completed = completedSteps.includes(number)
    if (completed) {
      return <img alt="white check in green circle" className="step-number completed" key={number} src={bigCheckSrc} />
    }
    return <div className={`step-number ${active ? 'active' : ''}`} key={number}>{number}</div>
  }

  renderReadPassageStep() {
    const { activeStep, } = this.state
    const { currentActivity, } = this.props.activities
    if (!currentActivity) return
    let className = 'step'
    let button
    if (activeStep === READ_PASSAGE_STEP) {
      className += ' active'
      button = <button className='done-reading-button' onClick={() => this.completeStep(READ_PASSAGE_STEP)}>Done reading</button>
    }
    return (<div className={className}>
      <div className="step-content" ref={(node) => this.step1 = node}>
        <div className="step-header">
          {this.renderStepNumber(READ_PASSAGE_STEP)}
          <p className="directions">Read the passage:</p>
        </div>
        <p className="passage-title">{currentActivity.title}</p>
        {button}
      </div>
    </div>)
  }

  renderPromptSteps() {
    const { activeStep, completedSteps } = this.state
    const { currentActivity, } = this.props.activities
    const { submittedResponses, } = this.props.session
    if (!currentActivity) return
    return currentActivity.prompts.map((prompt, i) => {
      // using i + 2 because the READ_PASSAGE_STEP is 1, so the first item in the set of prompts will always be 2
      const stepNumber = i + 2
      const everyOtherStepCompleted = completedSteps.filter(s => s !== stepNumber).length === 3
      return (<PromptStep
        active={stepNumber === activeStep}
        className={`step ${activeStep === stepNumber ? 'active' : ''}`}
        completeStep={() => this.completeStep(stepNumber)}
        everyOtherStepCompleted={everyOtherStepCompleted}
        onClick={() => this.activateStep(stepNumber)}
        passedRef={(node: JSX.Element) => this[`step${stepNumber}`] = node}
        prompt={prompt}
        stepNumberComponent={this.renderStepNumber(stepNumber)}
        submitResponse={this.submitResponse}
        submittedResponses={submittedResponses[prompt.prompt_id] || []}
      />)
    })
  }

  renderReadPassageContainer() {
    const { currentActivity, } = this.props.activities
    if (!currentActivity) return
    return (<div className="read-passage-container">
      <div>
        <p className="directions">Read the passage</p>
        <h1 className="title">{currentActivity.title}</h1>
        <div className="passage">
          {currentActivity.passages}
        </div>
      </div>
    </div>)
  }

  renderSteps() {
    return (<div className="steps-outer-container">
      <div className="steps-inner-container">
        {this.renderReadPassageStep()}
        {this.renderPromptSteps()}
      </div>
    </div>)
  }

  render() {
    const { hasReceivedData, } = this.props.activities
    if (!hasReceivedData) return <LoadingSpinner />
    return (<div className="activity-container">
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
