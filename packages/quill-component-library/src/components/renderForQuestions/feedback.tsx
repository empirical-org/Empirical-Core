import React from 'react';
const icon = 'https://assets.quill.org/images/icons/question_icon.svg';
const revise = 'https://assets.quill.org/images/icons/revise_orange_icon.svg';
const multiple = 'https://assets.quill.org/images/icons/multiple_choice_icon.svg';
const success  = 'https://assets.quill.org/images/icons/check-mark.svg';
const arrow = 'https://assets.quill.org/images/icons/correct_icon.svg';

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
      returnVal = icon;
      break;
    default:
      returnVal = icon;
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
    <div className={'feedback-row student-feedback-inner-container'}>
      <img className={getIconClassName(feedbackType)} src={getFeedbackIcon(feedbackType)}  />
      {feedback}
    </div>
  </div>
);

export { Feedback }
