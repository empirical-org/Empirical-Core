import * as React from 'react';

import getAnswerState from './answerState';

import { CORRECT_MATCHED, DEFAULT, DEFAULT_FILL_IN_BLANK, DEFAULT_WITH_CUES, Feedback, GET_QUESTION_INSTRUCTIONS, INSTRUCTIONS, OVERRIDE, REVISE_MATCHED, REVISE_UNMATCHED, getLatestAttempt } from '../../../Shared/index';

class FeedbackComponent extends React.Component<any, any> {

  getFeedbackType(data?): string {
    if (data) {
      const latestAttempt = getLatestAttempt(data.question.attempts);
      if (latestAttempt) {
        if (data.override) {
          return OVERRIDE
        } else if (latestAttempt.response.feedback !== undefined) {
          const state = getAnswerState(latestAttempt);
          return state ? CORRECT_MATCHED : REVISE_MATCHED
        } else {
          return REVISE_UNMATCHED
        }
      } else {
        if(!!data.question.instructions) {
          return INSTRUCTIONS
        }
        else if(data.question && data.question.instructions!=="") {
          return GET_QUESTION_INSTRUCTIONS
        }
        else if (data.question.prompt.match(/___/g) && data.question.prompt.match(/___/g).length > 0) {
          return DEFAULT_FILL_IN_BLANK
        }
        else if (data.question && data.question.cues && data.question.cues.length > 0 && data.question.cues[0] !== "") {
          return DEFAULT_WITH_CUES
        } else {
          return DEFAULT
        }
      }
    }
    return DEFAULT
  }

  getFeedbackCopy(data): string {
    const { question, sentence, renderFeedbackStatements } = data;
    const latestAttempt = getLatestAttempt(question.attempts);
    let returnVal;
    switch (this.getFeedbackType(data)) {
      case REVISE_UNMATCHED:
        returnVal = (<p>{sentence}</p>);
        break;
      case REVISE_MATCHED:
      case CORRECT_MATCHED:
        returnVal = renderFeedbackStatements(latestAttempt);
        break;
      case OVERRIDE:
        returnVal = (<p>{sentence}</p>);
        break;
      case INSTRUCTIONS:
        returnVal = (<p>{question.instructions}</p>);
        break;
      case GET_QUESTION_INSTRUCTIONS:
        returnVal = (<p>{question.instructions}</p>);
        break;
      case DEFAULT_FILL_IN_BLANK:
        returnVal = (<p>Fill in the blank with the correct option.</p>);
        break;
      case DEFAULT_WITH_CUES:
        const cues = question.cues
        if (cues.length === 1) {
          returnVal = (<p>Combine the sentences into one sentence. Use the joining word.</p>)
        } else {
          returnVal = (<p>Combine the sentences into one sentence. Use one of the joining words.</p>)
        }
        break;
      case DEFAULT:
        returnVal = (<p>Combine the sentences into one sentence.</p>)
        break;
      default:
        returnVal = (<p>Combine the sentences into one sentence.</p>)
    }
    return returnVal
  }

  render() {
    const { question, showTranslation, translate, latestAttempt } = this.props
    const key:number = question && question.attempts ? question.attempts.length : 0;
    if (question) {
      return (
        <Feedback
          feedback={this.getFeedbackCopy(this.props)}
          feedbackType={this.getFeedbackType(this.props)}
          key={key}
          latestAttempt={latestAttempt}
          question={question}
          showTranslation={showTranslation}
          translate={translate}
        />
      )
    } else {
      return <span />
    }
  }
}

export default FeedbackComponent;
