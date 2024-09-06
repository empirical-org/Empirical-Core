import * as React from 'react';
import { stripHtml } from "string-strip-html";

const icon = "https://assets.quill.org/images/icons/direction.svg"
const revise = "https://assets.quill.org/images/icons/revise.svg"
const multiple = "https://assets.quill.org/images/icons/multiple-choice.svg"
const success  = "https://assets.quill.org/images/icons/correct.svg"
const arrow = "https://assets.quill.org/images/icons/continue.svg"
const brownArrow = "https://assets.quill.org/images/icons/continue-brown.svg"

function getIconClassName(feedbackType: string): string {
  let returnVal;
  switch (feedbackType) {
    case 'revise-unmatched':
    case 'revise-matched':
      returnVal = 'revise';
      break;
    case 'correct-matched':
      returnVal = 'success';
      break;
    case 'override':
      returnVal = 'multiple';
      break;
    case "continue":
      returnVal = 'continue';
      break;
    case 'instructions':
    case 'getQuestion-instructions':
    case 'default-with-cues':
    case 'default':
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
    case "revise-unmatched":
    case "revise-matched":
      returnVal = revise;
      break;
    case "correct-matched":
      returnVal = success;
      break;
    case "override":
      returnVal = multiple;
      break;
    case "incorrect-continue":
      returnVal = brownArrow;
      break;
    case "continue":
      returnVal = arrow;
      break;
    case "instructions":
    case "getQuestion-instructions":
    case "default-with-cues":
    case "default":
    default:
      returnVal = icon;
  }
  return returnVal;
}

function getIconAlt(feedbackType: string): string {
  let returnVal;
  switch (feedbackType) {
    case "revise-unmatched":
    case "revise-matched":
      returnVal = 'Retry Icon';
      break;
    case "correct-matched":
      returnVal = 'Check Icon';
      break;
    case "override":
      returnVal = 'Choice Icon';
      break;
    case "incorrect-continue":
    case "continue":
      returnVal = 'Next Icon';
      break;
    case "instructions":
    case "getQuestion-instructions":
    case "default-with-cues":
    case "default":
    default:
      returnVal = 'Directions Icon';
  }
  return returnVal;
}

function getCSSClasses(feedbackType: string): string {
  let returnVal;
  switch (feedbackType) {
    case "revise-unmatched":
    case "revise-matched":
    case "incorrect-continue":
      returnVal = "revise"
      break;
    case "correct-matched":
      returnVal = "success"
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
  return "student-feedback-container " + returnVal
}

interface FeedbackProps {
  feedbackType: any,
  feedback: any,
  latestAttempt?: any,
  question?: any,
  showTranslation?: boolean,
  translate?: (input: string) => string
}

const Feedback = ({
  feedbackType,
  feedback,
  latestAttempt,
  question,
  showTranslation,
  translate
}: FeedbackProps) => {

  function getTranslatedFeedback(showTranslation, question, feedbackType) {
    if(!showTranslation) { return null }
    const showInstructions = feedbackType === 'instructions' || feedbackType === 'getQuestion-instructions'
    const showOverride = feedbackType === 'override' || feedbackType === 'revise-unmatched' || feedbackType === 'continue'
    const showCmsResponse = feedbackType === 'revise-matched' || feedbackType === 'correct-matched'
    let value
    if (question?.translation?.instructions && showInstructions) {
      const { translation } = question
      const { instructions } = translation
      value = instructions
    } else if(feedbackType === 'default-fill-in-blank') {
      value = translate('feedback^Fill in the blank with the correct option.')
    } else if(feedbackType === 'default-with-cues') {
      value = question?.cues?.length === 1 ? translate('feedback^Combine the sentences into one sentence. Use the joining word.') : translate('feedback^Combine the sentences into one sentence. Use one of the joining words.')
    } else if(feedbackType === 'default') {
      value = translate('feedback^Combine the sentences into one sentence. Use one of the joining words.')
    } else if (feedback && showOverride) {
      value = translate(`feedback^${feedback.props.children}`)
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

