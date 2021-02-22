import * as React from 'react';

import getAnswerState from './answerState';

import { Feedback, getLatestAttempt } from '../../../Shared/index';

class FeedbackComponent extends React.Component<any, any> {

  getFeedbackType(data?): string {
    if (data) {
      const latestAttempt = getLatestAttempt(data.question.attempts);
      if (latestAttempt) {
        if (data.override) {
          return "override"
        } else if (latestAttempt.response.feedback !== undefined) {
          const state = getAnswerState(latestAttempt);
          return state ? 'correct-matched' : 'revise-matched'
        } else {
          return "revise-unmatched"
        }
      } else {
        if(!!data.question.instructions) {
          return "instructions"
        }
        else if(data.question && data.question.instructions!=="") {
          return "getQuestion-instructions"
        }
        else if (data.question.prompt.match(/___/g).length > 0) {
          return "default-fill-in-blank"
        }
        else if (data.question && data.question.cues && data.question.cues.length > 0 && data.question.cues[0] !== "") {
          return "default-with-cues"
        } else {
          return "default"
        }
      }
    }
    return "default"
  }

  getFeedbackCopy(data): string {
    const { question, sentence, renderFeedbackStatements } = data;
    const latestAttempt = getLatestAttempt(question.attempts);
    let returnVal;
    switch (this.getFeedbackType(data)) {
      case "revise-unmatched":
        returnVal = (<p>{sentence}</p>);
        break;
      case "revise-matched":
      case "correct-matched":
        returnVal = renderFeedbackStatements(latestAttempt);
        break;
      case "override":
        returnVal = (<p>{sentence}</p>);
        break;
      case "instructions":
        returnVal = (<p>{question.instructions}</p>);
        break;
      case "getQuestion-instructions":
        returnVal = (<p>{question.instructions}</p>);
        break;
      case "default-fill-in-blank":
        returnVal = (<p>Fill in the blank with the correct option.</p>);
        break;
      case "default-with-cues":
        const cues = question.cues
        if (cues.length === 1) {
          returnVal = (<p>Combine the sentences into one sentence. Use the joining word.</p>)
        } else {
          returnVal = (<p>Combine the sentences into one sentence. Use one of the joining words.</p>)
        }
        break;
      case "default":
        returnVal = (<p>Combine the sentences into one sentence.</p>)
        break;
      default:
        returnVal = (<p>Combine the sentences into one sentence.</p>)
    }
    return returnVal
  }

  render() {
    const { question, } = this.props
    const key:number = question && question.attempts ? question.attempts.length : 0;
    if (question) {
      return (
        <Feedback
          feedback={this.getFeedbackCopy(this.props)}
          feedbackType={this.getFeedbackType(this.props)}
          key={key}
        />
      )
    } else {
      return <span />
    }
  }
}

export default FeedbackComponent;
