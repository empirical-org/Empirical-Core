import * as React from "react";
import {connect} from "react-redux";

import PromptStep from './promptStep'
import getParameterByName from '../../helpers/getParameterByName'
import { getActivity } from "../../actions/activities";
import { ActivitiesReducerState } from '../../reducers/activitiesReducer'

const bigCheckSrc =  `${process.env.QUILL_CDN_URL}/images/icons/check-circle-big.svg`

interface StudentViewContainerProps {
  dispatch: Function;
  activities: ActivitiesReducerState;
}

interface StudentViewContainerState {
  step: number;
  completedSteps: Array<number>;
}

class StudentViewContainer extends React.Component<StudentViewContainerProps, StudentViewContainerState> {
  private step1: any
  private step2: any
  private step3: any
  private step4: any

  constructor(props: StudentViewContainerProps) {
    super(props)

    this.state = {
      step: 1,
      completedSteps: []
    }

    this.step1 = React.createRef()
    this.step2 = React.createRef()
    this.step3 = React.createRef()
    this.step4 = React.createRef()
  }

  componentWillMount() {
    const activityUID = getParameterByName('uid', window.location.href)

    if (activityUID) {
      this.props.dispatch(getActivity(activityUID))
    }
  }

  goToNextStep = () => {
    const { step, completedSteps, } = this.state
    const newCompletedSteps = completedSteps.concat(step)
    const uniqueCompletedSteps = Array.from(new Set(newCompletedSteps))
    this.setState({ step: step + 1, completedSteps: uniqueCompletedSteps })
  }

  scrollToStep = (ref: string) => {
    this[ref].scrollIntoView(false)
  }

  renderStepLinks = () => {
    const { currentActivity, } = this.props.activities
    const links = []
    const numberOfLinks = currentActivity.prompts.length + 1

    for (let i=1; i <= numberOfLinks; i++ ) {
      links.push(<div onClick={() => this.scrollToStep(`step${i}`)}>{this.renderStepNumber(i)}</div>)
    }
    return <div className="hide-on-desktop step-links">
      {links}
    </div>
  }

  renderStepNumber(number: number) {
    const { step, completedSteps, } = this.state
    const active = step === number
    const completed = completedSteps.includes(number)
    if (completed) {
      return <img key={number} className="step-number completed" src={bigCheckSrc} alt="white check in green circle" />
    } else {
      return <div key={number} className={`step-number ${active ? 'active' : ''}`}>{number}</div>
    }
  }

  renderReadPassageStep() {
    const { step, } = this.state
    const { currentActivity, } = this.props.activities
    let className = 'step'
    let button
    if (step === 1) {
      className += ' active'
      button = <button onClick={this.goToNextStep}>Done reading</button>
    }
    return (<div className={className}>
      {this.renderStepNumber(1)}
      <div className="step-content" ref={(node) => this.step1 = node}>
        <p className="directions">Read the passage:</p>
        <p className="passage-title">{currentActivity.title}</p>
        {button}
      </div>
    </div>)
  }

  renderPromptSteps() {
    const { currentActivity, } = this.props.activities
    return currentActivity.prompts.map((prompt, i) => {
      const { text, } = prompt
      const stepNumber = i + 2
      return <PromptStep
        className='step'
        passedRef={(node) => this[`step${stepNumber}`] = node}
        stepNumberComponent={this.renderStepNumber(stepNumber)}
        text={text}
      />
    })
  }

  renderReadPassageContainer() {
    const { currentActivity, } = this.props.activities
    return <div className="read-passage-container">
      <div>
        <p className="directions">Read the passage</p>
        <h1 className="title">{currentActivity.title}</h1>
        <div className="passage">
          {currentActivity.passages}
        </div>
      </div>
    </div>
  }

  renderSteps() {
    return <div className="steps-container">
      {this.renderReadPassageStep()}
      {this.renderPromptSteps()}
    </div>
  }

  render() {
    const { hasReceivedData, } = this.props.activities
    if (hasReceivedData) {
      return <div className="activity-container">
        {this.renderStepLinks()}
        {this.renderReadPassageContainer()}
        {this.renderSteps()}
      </div>
    } else {
      return 'Loading'
    }
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
