import React from 'react'
import _ from 'underscore'
import icon from '../../img/question_icon.svg'
import revise from '../../img/revise_orange_icon.svg'
import multiple from '../../img/multiple_choice_icon.svg'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Feedback extends React.Component<any, any> {
  constructor(props){
    super(props)
  }

  getFeedbackType(data?): string {
    if (data) {
      const latestAttempt = getLatestAttempt(data.question.attempts);
      if (latestAttempt) {
        if (data.override) {
          return "override"
        } else if (latestAttempt.response.feedback !== undefined) {
          return "revise-matched"
        } else {
          return "revise-unmatched"
        }
      } else {
        if(!!data.question.instructions) {
          return "instructions"
        }
        else if(data.getQuestion && data.getQuestion().instructions!=="") {
          return "getQuestion-instructions"
        }
        else if (data.getQuestion && data.getQuestion().cues && data.getQuestion().cues.length > 0 && data.getQuestion().cues[0] !== "") {
          return "default-with-cues"
        } else {
          return "default"
        }
      }
    }
    return "default"
  }

  getFeedbackClassName(data): string {
    let returnVal;
    switch (this.getFeedbackType(data)) {
      case "revise-unmatched":
      case "revise-matched":
        returnVal = "revise"
        break;
      case "override":
      case "instructions":
      case "getQuestion-instructions":
      case "default-with-cues":
      case "default":
        returnVal = "default"
        break;
      default: 
        returnVal = "default"
    }
    return returnVal
  }

  getIconClassName(data): string {
    let returnVal;
    switch (this.getFeedbackType(data)) {
      case "revise-unmatched":
      case "revise-matched":
        returnVal = "revise"
        break;
      case "override":
        returnVal = "multiple"
        break;
      case "instructions":
      case "getQuestion-instructions":
      case "default-with-cues":
      case "default":
        returnVal = "info"
        break;
      default: 
        returnVal = "info"
    }
    return returnVal
  }

  getFeedbackIcon(data): string {
    let returnVal;
    switch (this.getFeedbackType(data)) {
      case "revise-unmatched":
      case "revise-matched":
        returnVal = revise
        break;
      case "override":
        returnVal = multiple
        break;
      case "instructions":
      case "getQuestion-instructions":
      case "default-with-cues":
      case "default":
        returnVal = icon
        break;
      default: 
        returnVal = icon
    }
    return returnVal
  } 

  getFeedbackCopy(data): string {
    const latestAttempt = getLatestAttempt(data.question.attempts);
    let returnVal;
    switch (this.getFeedbackType(data)) {
      case "revise-unmatched":
        returnVal = (<p>{data.sentence}</p>);
        break;
      case "revise-matched":
        returnVal = data.renderFeedbackStatements(latestAttempt);
        break;
      case "override":
        returnVal = (<p>{data.sentence}</p>);
        break;
      case "instructions":
        returnVal = (<p>{data.question.instructions}</p>);
        break;
      case "getQuestion-instructions":
        returnVal = (<p>{data.getQuestion().instructions}</p>);
        break;
      case "default-with-cues":
        returnVal = (<p>Combine the sentences using {data.listCuesAsString(data.getQuestion().cues)}</p>);
        break;
      case "default":
        returnVal = (<p>Combine the sentences into one sentence.</p>)
        break;
      default: 
        returnVal = (<p>Combine the sentences into one sentence.</p>)
    }
    return returnVal
  } 

  renderFeedback(): JSX.Element {
    const data = this.props;
    const latestAttempt = getLatestAttempt(data.question.attempts);
    const key:number = data.question.attempts.length;
    return (
      <div className={`feedback-row student-feedback-inner-container`} key={key}>
        <img className={this.getIconClassName(data)} src={this.getFeedbackIcon(data)}/>
        {this.getFeedbackCopy(data)}
      </div>
    )
  }

  render() {
    const activeClass = "student-feedback-container " + (this.props ? this.getFeedbackClassName(this.props) : "");
    return (
      <div className={activeClass}>
        <ReactCSSTransitionGroup
          transitionName="feedback-flash"
          transitionEnterTimeout={500}
        >
          {this.renderFeedback()}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default Feedback;

const getLatestAttempt = function (attempts: Array<any> = []): any {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex]
}
