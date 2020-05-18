import * as React from "react";
import { promptStems } from '../constants/comprehension';
import stripHtml from "string-strip-html";
const quillCheckmark = 'https://assets.quill.org/images/icons/check-circle-small.svg';

export const getPromptsIcons = (prompts) => {
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

export const validateForm = (keys, state) => {
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
