import React from 'react';
const icon = `${process.env.QUILL_CDN_URL}/images/icons/direction.svg`
const revise = `${process.env.QUILL_CDN_URL}/images/icons/revise.svg`
const multiple = `${process.env.QUILL_CDN_URL}/images/icons/multiple-choice.svg`
const success  = `${process.env.QUILL_CDN_URL}/images/icons/correct.svg`
const arrow = `${process.env.QUILL_CDN_URL}/images/icons/continue.svg`

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

const Feedback = ({ feedbackType, feedback, }: any) => (
  <div className={getCSSClasses(feedbackType)}>
    <div className='feedback-row student-feedback-inner-container'>
      <img alt={getIconAlt(feedbackType)} className={getIconClassName(feedbackType)} src={getFeedbackIcon(feedbackType)}  />
      {feedback}
    </div>
  </div>
);

export { Feedback }
