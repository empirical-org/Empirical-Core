import * as React from 'react';
import { stripHtml } from "string-strip-html";
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

const icon = "https://assets.quill.org/images/icons/direction.svg"
const revise = "https://assets.quill.org/images/icons/revise.svg"
const multiple = "https://assets.quill.org/images/icons/multiple-choice.svg"
const success  = "https://assets.quill.org/images/icons/correct.svg"
const arrow = "https://assets.quill.org/images/icons/continue.svg"
const brownArrow = "https://assets.quill.org/images/icons/continue-brown.svg"

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
    const showCmsResponse = feedbackType === REVISE_MATCHED || feedbackType === CORRECT_MATCHED
    let value
    if (question?.translation?.instructions && showInstructions) {
      const { translation } = question
      const { instructions } = translation
      value = instructions
    } else if(feedbackType === DEFAULT_FILL_IN_BLANK) {
      value = translate('feedback^Fill in the blank with the correct option.')
    } else if(feedbackType === DEFAULT_WITH_CUES) {
      value = question?.cues?.length === 1 ? translate('feedback^Combine the sentences into one sentence. Use the joining word.') : translate('feedback^Combine the sentences into one sentence. Use one of the joining words.')
    } else if(feedbackType === DEFAULT) {
      value = translate('feedback^Combine the sentences into one sentence. Use one of the joining words.')
    } else if (feedback && showOverride) {
      value = translate(`feedback^${feedback.props.children}`)
    } else if (feedbackType === INCORRECT_CONTINUE) {
      const firstPhrase = translate('feedback^Good try!')
      const secondPhrase = translate('feedback^Compare your response to the strong response, and then go on to the next question')
      const thirdPhrase = translate('feedback^Your response:')
      const fourthPhrase = translate('feedback^A strong response:')
      value = `<b>${firstPhrase}</b>${secondPhrase}<br><br><b>${thirdPhrase}</b><br>${latestAttempt}<br><br><b>${fourthPhrase}</b><br>${correctResponse}`
    } else if (question?.translation?.cms_responses && latestAttempt?.response && showCmsResponse) {
      const { response } = latestAttempt
      const { translation } = question
      const { cms_responses } = translation
      const id = response.id || response.parent_id
      const translatedResponse = cms_responses[`cms_responses.${id}`]
      value = stripHtml(translatedResponse).result
    }
    return <p>{value}</p>
  }
  const translatedFeedback = getTranslatedFeedback(showTranslation, question, feedbackType)
  return(
    <div aria-live="assertive" className={getCSSClasses(feedbackType)} role="status">
      <div className='feedback-row student-feedback-inner-container'>
        <img alt={getIconAlt(feedbackType)} className={getIconClassName(feedbackType)} src={getFeedbackIcon(feedbackType)} />
        <div>
          {feedback}
          {translatedFeedback}
        </div>
      </div>
    </div>
  )
}

export { Feedback };

