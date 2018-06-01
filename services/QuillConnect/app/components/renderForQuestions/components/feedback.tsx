import React from 'react';
import icon from '../../../img/question_icon.svg';
import revise from '../../../img/revise_orange_icon.svg';
import multiple from '../../../img/multiple_choice_icon.svg';
import success  from '../../../img/check-mark.svg';
import arrow from '../../../img/correct_icon.svg';

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

export default ({ feedbackType, feedback, }) => (
  <div className={getCSSClasses(feedbackType)}>
    <div className={'feedback-row student-feedback-inner-container'}>
      <img className={getIconClassName(feedbackType)} src={getFeedbackIcon(feedbackType)}  />
      {feedback}
    </div>
  </div>
);
