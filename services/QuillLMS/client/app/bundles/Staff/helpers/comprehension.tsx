import * as React from "react";
import stripHtml from "string-strip-html";

import { promptStems, DEFAULT_MAX_ATTEMPTS, BECAUSE, MINIMUM_READING_LEVEL, MAXIMUM_READING_LEVEL, TARGET_READING_LEVEL, SCORED_READING_LEVEL } from '../../../constants/comprehension';
import { ActivityRuleSetPrompt, PromptInterface } from '../interfaces/comprehensionInterfaces'

const quillCheckmark = 'https://assets.quill.org/images/icons/check-circle-small.svg';
const baseUrl = `${process.env.DEFAULT_URL}/api/v1/comprehension/`;;
const fetchDefaults = require("fetch-defaults");

export const apiFetch = fetchDefaults(fetch, baseUrl, {
  headers: {
    "Accept": "application/JSON",
    "Content-Type": "application/json"
  }
})

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
  activityParentActivityId,
  activityPassages,
  activityMaxFeedback,
  activityBecausePrompt,
  activityButPrompt,
  activitySoPrompt
}) => {
  // const { label } = activityFlag;
  const prompts = [activityBecausePrompt, activityButPrompt, activitySoPrompt].map(prompt => {
    prompt.max_attempts_feedback = activityMaxFeedback
    return prompt;
  });
  return {
    activity: {
      title: activityTitle,
      parent_activity_id: parseInt(activityParentActivityId),
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

const targetReadingLevelError = (value: string) => {
  if(!value) {
    return `${TARGET_READING_LEVEL} must be a number between 4 and 12, and cannot be blank.`
  }
  const num = parseInt(value);
  if(num < MINIMUM_READING_LEVEL || num > MAXIMUM_READING_LEVEL) {
    return `${TARGET_READING_LEVEL} must be a number between ${MINIMUM_READING_LEVEL} and ${MAXIMUM_READING_LEVEL}.`
  }
}

const scoredReadingLevelError = (value: string) => {
  if(value === '') {
    return;
  }
  const num = parseInt(value);
  if(isNaN(num) || num < 4 || num > 12) {
    return `${SCORED_READING_LEVEL} must be a number between 4 and 12, or left blank.`;
  }
}

export const validateForm = (keys: string[], state: string[]) => {
  let errors = {};
  state.map((value, i) => {
    switch(keys[i]) {
      case TARGET_READING_LEVEL:
        const targetError = targetReadingLevelError(value);
        if(targetError) {
          errors[TARGET_READING_LEVEL] = targetError;
        }
        break;
      case SCORED_READING_LEVEL:
        const scoredError = scoredReadingLevelError(value);
        if(scoredError) {
          errors[SCORED_READING_LEVEL] = scoredError
        }
        break;
      default:
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
