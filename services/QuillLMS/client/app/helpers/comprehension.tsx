import * as React from "react";
import { promptStems, DEFAULT_MAX_ATTEMPTS } from '../constants/comprehension';
import { ActivityRuleSetPrompt } from '../bundles/Staff/interfaces/comprehensionInterfaces'
import stripHtml from "string-strip-html";
const quillCheckmark = 'https://assets.quill.org/images/icons/check-circle-small.svg';

export const getPromptsIcons = (prompts: ActivityRuleSetPrompt[]) => {
  const icons = {};
  prompts.forEach(prompt => {
    const { conjunction } = prompt;
    if(promptStems.includes(conjunction)) {
      icons[conjunction] = (<img alt="quill-circle-checkmark" src={quillCheckmark} />)
    } else {
      icons[conjunction] = (<div />);
    }
  });
  return icons;
}

export const buildBlankPrompt = (conjunction: string) => {
  return {
    conjunction: conjunction,
    text: '',
    max_attempts: DEFAULT_MAX_ATTEMPTS,
    max_attempts_feedback: ''
  }
}

export const validateForm = (keys: string[], state: string[]) => {
  let errors = {};
  state.map((value, i) => {
    // strip TextEditor value of breaks or whitespaces
    const strippedValue = stripHtml(value);
    if(!strippedValue || strippedValue.length === 0) {
      errors[keys[i]] = `${keys[i]} cannot be blank.`;
    }
  });
  return errors;
}

// not a 2xx status
export const requestFailed = (status: number ) => Math.round(status / 100) !== 2;

export const buildErrorMessage = (errors: object) => {
  let message: string;
  Object.keys(errors).map((error, i) => {
    if(i === 0) {
      message = `${errors[error]}`;
    } else {
      message = message + `, ${errors[error]}`;
    }
  });
  return message;
}
