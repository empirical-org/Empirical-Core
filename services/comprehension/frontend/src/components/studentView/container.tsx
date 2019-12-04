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

  renderReadPassageStep() {
    const { step, completedSteps, } = this.state
    const { currentActivity, } = this.props.activities
    let className = 'step'
    let button
    let stepNumber = <div className="step-number">1</div>
    if (step === 1) {
      className += ' active'
      button = <button onClick={this.goToNextStep}>Done reading</button>
    }
    if (completedSteps.includes(1)) {
      stepNumber = <img className="step-number completed" src={bigCheckSrc} alt="white check in green circle" />
    }
    return (<div className={className}>
      {stepNumber}
      <div className="step-content">
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
      return (<div className={className}>
        <div className="step-number">{i + 2}</div>
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
