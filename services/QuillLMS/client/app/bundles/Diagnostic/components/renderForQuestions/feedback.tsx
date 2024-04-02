import * as React from 'react';
import { Feedback } from '../../../Shared/index';
import getAnswerState from './answerState';

class FeedbackComponent extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

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
        if (!!data.question.instructions) {
          return "instructions"
        }
        else if (data.getQuestion && data.getQuestion().instructions !== "") {
          return "getQuestion-instructions"
        }
        else if (data.question.prompt.match(/___/g) && data.question.prompt.match(/___/g).length > 0) {
          return "default-fill-in-blank"
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

  getFeedbackCopy(data): string {
    const latestAttempt = getLatestAttempt(data.question.attempts);
    let returnVal;
    switch (this.getFeedbackType(data)) {
      case "revise-unmatched":
        returnVal = (<p>{data.sentence}</p>);
        break;
      case "revise-matched":
      case "correct-matched":
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
      case "default-fill-in-blank":
        returnVal = (<p>Fill in the blank with the correct option.</p>);
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

  render() {
    const { question, } = this.props
    const key:number = question ? question.attempts.length : 0;
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

const getLatestAttempt = function (attempts: Array<any> = []): any {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex]
}
