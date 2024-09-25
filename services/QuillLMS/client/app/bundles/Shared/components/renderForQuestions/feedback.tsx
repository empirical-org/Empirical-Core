import * as React from 'react';
import ReactHtmlParser from 'react-html-parser'

import {
  REVISE_MATCHED,
  REVISE_UNMATCHED,
  CORRECT_MATCHED,
  OVERRIDE,
  CONTINUE,
  INCORRECT_CONTINUE,
  INSTRUCTIONS,
  GET_QUESTION_INSTRUCTIONS,
  DEFAULT_WITH_CUES,
  DEFAULT,
  DEFAULT_FILL_IN_BLANK
} from '../../utils/constants';
import C from '../../../Connect/constants';

const icon = "https://assets.quill.org/images/icons/direction.svg"
const revise = "https://assets.quill.org/images/icons/revise.svg"
const multiple = "https://assets.quill.org/images/icons/multiple-choice.svg"
const success  = "https://assets.quill.org/images/icons/correct.svg"
const arrow = "https://assets.quill.org/images/icons/continue.svg"
const brownArrow = "https://assets.quill.org/images/icons/continue-brown.svg"
const CONNECT_FILL_IN_BLANKS = "connect_fill_in_blanks"

function getIconClassName(feedbackType: string): string {
  let returnVal;
  switch (feedbackType) {
    case REVISE_UNMATCHED:
    case REVISE_MATCHED:
      returnVal = 'revise';
      break;
    case CORRECT_MATCHED:
      returnVal = 'success';
      break;
    case OVERRIDE:
      returnVal = 'multiple';
      break;
    case CONTINUE:
      returnVal = 'continue';
      break;
    case INSTRUCTIONS:
    case GET_QUESTION_INSTRUCTIONS:
    case DEFAULT_WITH_CUES:
    case DEFAULT:
      returnVal = 'info';
      break;
    default:
      returnVal = 'info';
  }
  return returnVal;
}

function getFeedbackIcon(feedbackType: string): string {
  let returnVal;
  switch (feedbackType) {
    case REVISE_UNMATCHED:
    case REVISE_MATCHED:
      returnVal = revise;
      break;
    case CORRECT_MATCHED:
      returnVal = success;
      break;
    case OVERRIDE:
      returnVal = multiple;
      break;
    case INCORRECT_CONTINUE:
      returnVal = brownArrow;
      break;
    case CONTINUE:
      returnVal = arrow;
      break;
    case INSTRUCTIONS:
    case GET_QUESTION_INSTRUCTIONS:
    case DEFAULT_WITH_CUES:
    case DEFAULT:
    default:
      returnVal = icon;
  }
  return returnVal;
}

function getIconAlt(feedbackType: string): string {
  let returnVal;
  switch (feedbackType) {
    case REVISE_UNMATCHED:
    case REVISE_MATCHED:
      returnVal = 'Retry Icon';
      break;
    case CORRECT_MATCHED:
      returnVal = 'Check Icon';
      break;
    case OVERRIDE:
      returnVal = 'Choice Icon';
      break;
    case INCORRECT_CONTINUE:
    case CONTINUE:
      returnVal = 'Next Icon';
      break;
    case INSTRUCTIONS:
    case GET_QUESTION_INSTRUCTIONS:
    case DEFAULT_WITH_CUES:
    case DEFAULT:
    default:
      returnVal = 'Directions Icon';
  }
  return returnVal;
}

function getCSSClasses(feedbackType: string): string {
  let returnVal;
  switch (feedbackType) {
    case REVISE_UNMATCHED:
    case REVISE_MATCHED:
    case INCORRECT_CONTINUE:
      returnVal = "revise"
      break;
    case CORRECT_MATCHED:
      returnVal = "success"
      break;
    case OVERRIDE:
    case INSTRUCTIONS:
    case GET_QUESTION_INSTRUCTIONS:
    case DEFAULT_WITH_CUES:
    case DEFAULT:
      returnVal = "default"
      break;
    default:
      returnVal = "default"
  }
  return "student-feedback-container " + returnVal
}

interface FeedbackProps {
  correctResponse?: string,
  feedbackType: any,
  feedback: any,
  latestAttempt?: any,
  question?: any,
  showTranslation?: boolean,
  translate?: (input: string) => string
}

function translatedCMSResponseFeedback(latestAttempt, question) {
  const { response } = latestAttempt
  const { translation } = question
  const { cms_responses } = translation
  const id = response.id || response.parent_id
  const translatedResponse = cms_responses[`cms_responses.${id}`]
  return translatedResponse ? ReactHtmlParser(translatedResponse) : null
}

function translatedIncorrectContinueFeedback(translate, latestAttempt, correctResponse) {
  const firstPhrase = translate('feedback^Good try!')
  const secondPhrase = translate('feedback^Compare your response to the strong response, and then go on to the next question.')
  const thirdPhrase = translate('feedback^Your response:')
  const fourthPhrase = translate('feedback^A strong response:')
  return ReactHtmlParser(`<p class="incorrect-continue"><b>${firstPhrase}</b>${secondPhrase}<br><br><b>${thirdPhrase}</b><br>${latestAttempt}<br><br><b>${fourthPhrase}</b><br>${correctResponse}</p>`)
}

function translatedReviseMatchedFeedback(question, latestAttempt, translate) {
  const { response } = latestAttempt
  if (response?.isIncorrectSequence && question?.translation?.incorrectSequences) {
    const { uid } = response
    const { translation } = question
    const { incorrectSequences } = translation
    const key = `incorrectSequences.${uid}`
    return incorrectSequences[key] ? ReactHtmlParser(incorrectSequences[key]) : null
  }
  if (response?.isFocusPoint && question?.translation?.focusPoints) {
    const { uid } = response
    const { translation } = question
    const { focusPoints } = translation
    const key = `focusPoints.${uid}`
    return focusPoints[key] ? ReactHtmlParser(focusPoints[key]) : null
  }
  if(response?.author) {
    const { author, feedback } = response
    if(author === "Quotation Mark Hint") {
      return(
        <span>
          <br />
          <p>{translate('feedback^It looks like you might have used two apostrophes to make a quotation mark.')}</p>
          <p>{translate('feedback^Instead of hitting the apostrophe key twice to make a quotation mark, hold down the shift key and hit the apostrophe key once.')}</p>
        </span>
      )
    }
    if(C.ERROR_AUTHORS.includes(author)) {
      return translate(`feedback^${feedback}`)
    }
  }
  if(response) {
    return <p>{translatedCMSResponseFeedback(latestAttempt, question)}</p>
  }
}

function renderFeedback(feedback) {
  if (feedback && typeof feedback === 'string') {
    feedback = <p>{feedback}</p>
  }
  return feedback
}

const Feedback = ({
  correctResponse,
  feedbackType,
  feedback,
  latestAttempt,
  question,
  showTranslation,
  translate
}: FeedbackProps) => {

  function getTranslatedFeedback(showTranslation, question, feedbackType) {
    if(!showTranslation) { return null }

    const showInstructions = feedbackType === INSTRUCTIONS || feedbackType === GET_QUESTION_INSTRUCTIONS
    const showOverride = feedbackType === OVERRIDE || feedbackType === REVISE_UNMATCHED || feedbackType === CONTINUE
    const showCMSResponse = feedbackType === CORRECT_MATCHED || (feedbackType === REVISE_MATCHED && question?.question_type === CONNECT_FILL_IN_BLANKS)

    if (question?.translation?.instructions && showInstructions) {
      const { translation } = question
      const { instructions } = translation
      return renderFeedback(instructions)
    }
    if(feedbackType === DEFAULT_FILL_IN_BLANK) {
      const value = translate('feedback^Fill in the blank with the correct option.')
      return renderFeedback(value)
    }
    if(feedbackType === DEFAULT_WITH_CUES) {
      const value = question?.cues?.length === 1 ? translate('feedback^Combine the sentences into one sentence. Use the joining word.') : translate('feedback^Combine the sentences into one sentence. Use one of the joining words.')
      return renderFeedback(value)
    }
    if(feedbackType === DEFAULT) {
      const value = translate('feedback^Combine the sentences into one sentence. Use one of the joining words.')
      return renderFeedback(value)
    }
    if (feedback && showOverride) {
      const value = translate(`feedback^${feedback.props.children}`)
      return renderFeedback(value)
    }
    if (feedbackType === INCORRECT_CONTINUE) {
      const value = translatedIncorrectContinueFeedback(translate, latestAttempt, correctResponse)
      return renderFeedback(value)
    }
    if (showCMSResponse) {
      const value = translatedCMSResponseFeedback(latestAttempt, question)
      return renderFeedback(value)
    }
    if (feedbackType === REVISE_MATCHED) {
      const value = translatedReviseMatchedFeedback(question, latestAttempt, translate)
      return renderFeedback(value)
    }
  }

  function renderFeedbackElement() {
    const translatedFeedback = getTranslatedFeedback(showTranslation, question, feedbackType)
    if(!translatedFeedback) { return }
    return <div className="translated-feedback">{translatedFeedback}</div>
  }


  return(
    <div aria-live="assertive" className={getCSSClasses(feedbackType)} role="status">
      <div className='feedback-row student-feedback-inner-container'>
        <img alt={getIconAlt(feedbackType)} className={getIconClassName(feedbackType)} src={getFeedbackIcon(feedbackType)} />
        <div>
          {feedback}
          {renderFeedbackElement()}
        </div>
      </div>
    </div>
  )
}

export { Feedback };

