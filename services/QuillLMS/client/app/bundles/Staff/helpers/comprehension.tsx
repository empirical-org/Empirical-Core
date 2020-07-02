import * as React from "react";
import { promptStems, DEFAULT_MAX_ATTEMPTS, BECAUSE } from '../../../constants/comprehension';
import { ActivityRuleSetPrompt, PromptInterface } from '../interfaces/comprehensionInterfaces'
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

export const buildActivity = ({
  activityTitle,
  activityScoredReadingLevel,
  activityTargetReadingLevel,
  activityPassages,
  activityMaxFeedback,
  activityBecausePrompt,
  activityButPrompt,
  activitySoPrompt,
  parent_activity_id,
}) => {
  // const { label } = activityFlag;
  const prompts = [activityBecausePrompt, activityButPrompt, activitySoPrompt].map(prompt => {
    prompt.max_attempts_feedback = activityMaxFeedback
    return prompt;
  });
  return {
    activity: {
      title: activityTitle,
      parent_activity_id,
      // flag: label,
      scored_level: activityScoredReadingLevel,
      target_level: parseInt(activityTargetReadingLevel),
      passages_attributes: activityPassages,
      prompts_attributes: [
        formatPrompt(prompts[0]), 
        formatPrompt(prompts[1]), 
        formatPrompt(prompts[2])
      ]
    }
  };
}

export const promptsByConjunction = (prompts: PromptInterface[]) => {
  const formattedPrompts = {};
  prompts && prompts.map((prompt: PromptInterface) => formattedPrompts[prompt.conjunction] = prompt);
  return formattedPrompts;
}

export const formatPrompt = (prompt: PromptInterface) => {
  let formattedPrompt = prompt;
  const text = formattedPrompt.text;
  const lastChar = text.charAt(text.length - 1);
  if(lastChar !== ',' && prompt.conjunction !== BECAUSE) {
    formattedPrompt.text = text + ',';
  } else if(lastChar === ',' && prompt.conjunction === BECAUSE) {
    formattedPrompt.text = text.slice(0, -1);
  }
  return formattedPrompt;
}

export const validateForm = (keys: string[], state: string[]) => {
  let errors = {};
  state.map((value, i) => {
    if(keys[i] === 'Target reading level') {
      if(!value) {
        errors[keys[i]] = `${keys[i]} must be a number between 4 and 12, and cannot be blank.`;
      } else {
        const num = parseInt(value);
        if(num < 4 || num > 12) {
          errors[keys[i]] = `${keys[i]} must be a number between 4 and 12.`;
        }
      }
    } else if(keys[i] === 'Scored reading level' && value !== '') {
      const num = parseInt(value);
      if(isNaN(num) || num < 4 || num > 12) {
        errors[keys[i]] = `${keys[i]} must be a number between 4 and 12, or left blank.`;
      }
    } else if(keys[i] !== 'Scored reading level') {
      // strip TextEditor value of breaks or whitespaces
      const strippedValue = stripHtml(value);
      if(!strippedValue || strippedValue.length === 0) {
        errors[keys[i]] = `${keys[i]} cannot be blank.`;
      }
    }

  });
  return errors;
}

// not a 2xx status
export const requestFailed = (status: number ) => Math.round(status / 100) !== 2;

export const buildErrorMessage = (errors: object) => Object.values(errors).join(', ');

export const handleApiError = (errorMessage: string, response: any) => {
  let error: string;
  const { status } = response;
  if(requestFailed(status)) {
    error = errorMessage;
  }
  return error;
}

export const getCsrfToken = () => document.querySelector('meta[name="csrf-token"]').getAttribute('content');
