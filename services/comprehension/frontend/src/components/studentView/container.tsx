import * as React from "react";
import {connect} from "react-redux";

import PromptStep from './promptStep'
import LoadingSpinner from '../shared/loadingSpinner'
import getParameterByName from '../../helpers/getParameterByName'
import { getActivity } from "../../actions/activities";
import { ActivitiesReducerState } from '../../reducers/activitiesReducer'

const bigCheckSrc =  `${process.env.QUILL_CDN_URL}/images/icons/check-circle-big.svg`

interface StudentViewContainerProps {
  dispatch: Function;
  activities: ActivitiesReducerState;
}

interface StudentViewContainerState {
  activeStep: number;
  completedSteps: Array<number>;
}

const READ_PASSAGE_STEP = 1

export class StudentViewContainer extends React.Component<StudentViewContainerProps, StudentViewContainerState> {
  private step1: any // eslint-disable-line react/sort-comp
  private step2: any // eslint-disable-line react/sort-comp
  private step3: any // eslint-disable-line react/sort-comp
  private step4: any // eslint-disable-line react/sort-comp

  constructor(props: StudentViewContainerProps) {
    super(props)

    this.state = {
      activeStep: 1,
      completedSteps: []
    }

    this.step1 = React.createRef()
    this.step2 = React.createRef()
    this.step3 = React.createRef()
    this.step4 = React.createRef()
  }

  componentDidMount() {
    const activityUID = getParameterByName('uid', window.location.href)

    if (activityUID) {
      this.props.dispatch(getActivity(activityUID))
    }
  }

  goToNextStep = () => {
    const { activeStep, completedSteps, } = this.state
    const newCompletedSteps = completedSteps.concat(activeStep)
    const uniqueCompletedSteps = Array.from(new Set(newCompletedSteps))
    this.setState({ activeStep: activeStep + 1, completedSteps: uniqueCompletedSteps })
  }

  scrollToStep = (ref: string) => {
    this[ref].scrollIntoView(false)
  }

  renderStepLinks = () => {
    const { currentActivity, } = this.props.activities
    if (!currentActivity) return

    const links = []
    const numberOfLinks = currentActivity.prompts.length + 1

    for (let i=1; i <= numberOfLinks; i++ ) {
      links.push(<div onClick={() => this.scrollToStep(`step${i}`)}>{this.renderStepNumber(i)}</div>)
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
      button = <button className='done-reading-button' onClick={this.goToNextStep}>Done reading</button>
    }
    return (<div className={className}>
      {this.renderStepNumber(READ_PASSAGE_STEP)}
      <div className="step-content" ref={(node) => this.step1 = node}>
        <p className="directions">Read the passage:</p>
        <p className="passage-title">{currentActivity.title}</p>
        {button}
      </div>
    </div>)
  }

  renderPromptSteps() {
    const { currentActivity, } = this.props.activities
    if (!currentActivity) return
    return currentActivity.prompts.map((prompt, i) => {
      const { text, } = prompt
      // using i + 2 because the READ_PASSAGE_STEP is 1, so the first item in the set of prompts will always be 2
      const stepNumber = i + 2
      return (<PromptStep
        className='step'
        passedRef={(node: JSX.Element) => this[`step${stepNumber}`] = node}
        stepNumberComponent={this.renderStepNumber(stepNumber)}
        text={text}
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
    return (<div className="steps-container">
      {this.renderReadPassageStep()}
      {this.renderPromptSteps()}
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
    activities: state.activities
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentViewContainer);
