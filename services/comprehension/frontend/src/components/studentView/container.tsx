import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";

import getParameterByName from '../../helpers/getParameterByName'
import { getActivity } from "../../actions/activities";

const bigCheckSrc =  `${process.env.QUILL_CDN_URL}/images/icons/check-circle-big.svg`

interface StudentViewContainerProps {
  dispatch: Function;
  activities: any;
}

interface StudentViewContainerState {
  step: number;
  completedSteps: Array<number>;
}

class StudentViewContainer extends React.Component<StudentViewContainerProps, StudentViewContainerState> {
  constructor(props: StudentViewContainerProps) {
    super(props)

    this.state = {
      step: 1,
      completedSteps: []
    }
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
      let className = 'step'
      const allButLastWordOfPrompt = text.substring(0, text.lastIndexOf(' '))
      const lastWordOfPrompt = text.split(' ').splice('-1')
      const stepNumber = i + 2
      return (<div className={className} ref={(node) => this[`step${stepNumber}`] = node}>
        {this.renderStepNumber(stepNumber)}
        <div className="step-content">
          <p className="directions">Use information from the text to finish the sentence:</p>
          <p className="prompt-text">{allButLastWordOfPrompt} <span>{lastWordOfPrompt}</span></p>
        </div>
      </div>)
    })
  }

  render() {
    const { currentActivity, hasReceivedData, } = this.props.activities
    if (hasReceivedData) {
      return <div className="activity-container">
        {this.renderStepLinks()}
        <div className="read-passage-container">
          <div>
            <p className="directions">Read the passage</p>
            <h1 className="title">{currentActivity.title}</h1>
            <div className="passage">
              {currentActivity.passages}
            </div>
          </div>
        </div>
        <div className="steps-container">
          {this.renderReadPassageStep()}
          {this.renderPromptSteps()}
        </div>
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
