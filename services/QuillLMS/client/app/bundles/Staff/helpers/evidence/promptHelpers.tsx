import * as React from "react";

import {
  promptStems,
  DEFAULT_MAX_ATTEMPTS,
  BECAUSE,
  BUT,
  SO,
  ALL
} from '../../../../constants/evidence';
import { PromptInterface } from '../../interfaces/evidenceInterfaces';
const quillCheckmark = `/images/green_check.svg`;

export const getPromptsIcons = (activityData, promptIds: number[]) => {
  if(activityData && activityData.activity && activityData.activity.prompts) {
    const { activity } = activityData;
    const { prompts } = activity;
    const attachedPrompts = prompts.filter(prompt => promptIds.includes(prompt.id));
    const icons = {};
    attachedPrompts.forEach(prompt => {
      const { conjunction } = prompt;
      if(promptStems.includes(conjunction)) {
        icons[conjunction] = (<img alt="quill-circle-checkmark" src={quillCheckmark} />)
      } else {
        icons[conjunction] = (<div />);
      }
    });
    return icons;
  }
  return {};
}

export const buildBlankPrompt = (conjunction: string) => {
  return {
    conjunction: conjunction,
    text: '',
    max_attempts: DEFAULT_MAX_ATTEMPTS,
    max_attempts_feedback: ''
  }
}

export const formatPrompts = ({ activityData, rule, setRulePrompts }) => {
  let checkedPrompts = {};
  let formatted = {};

  // get ids of all applied prompts
  rule && rule.prompt_ids && rule.prompt_ids.forEach(id => {
    checkedPrompts[id] = true;
  });

  // use activity data to apply each prompt ID
  activityData && activityData.prompts && activityData.prompts.forEach((prompt: PromptInterface) => {
    const { conjunction, id } = prompt;
    formatted[conjunction] = {
      id,
      checked: !!checkedPrompts[id]
    };
  });

  setRulePrompts(formatted);
}

export function getPromptForComponent(activityData: any, key: string) {
  if(!activityData || activityData && !activityData.activity) {
    return null;
  }
  const { activity } = activityData;
  const { prompts } = activity;
  const promptsHash = {};
  prompts.forEach(prompt => promptsHash[prompt.conjunction] = [prompt]);
  promptsHash['all'] = [promptsHash[BECAUSE][0], promptsHash[BUT][0], promptsHash[SO][0]];
  return promptsHash[key];
}

export const promptsByConjunction = (prompts: PromptInterface[]) => {
  const formattedPrompts = {};
  prompts && prompts.map((prompt: PromptInterface) => formattedPrompts[prompt.conjunction] = prompt);
  return formattedPrompts;
}

export function getPromptConjunction(activityData: any, id: number | string) {
  if(!activityData || activityData && !activityData.activity) {
    return null;
  }
  const { activity } = activityData;
  const { prompts } = activity;
  const formattedId = typeof id === 'string' ? parseInt(id) : id;
  const appliedPrompt = prompts.filter(prompt => prompt.id === formattedId)[0];
  if(!appliedPrompt) {
    return ALL;
  }
  return appliedPrompt.conjunction;
}

export function getActivityPrompt({
  activityBecausePrompt,
  activityButPrompt,
  activitySoPrompt,
  conjunction
}) {
  let prompt;
  switch(conjunction) {
    case BECAUSE:
      prompt = {...activityBecausePrompt};
      break;
    case BUT:
      prompt = {...activityButPrompt};
      break;
    case SO:
      prompt = {...activitySoPrompt};
      break;
    default:
      prompt;
  }
  return prompt;
};

export function getActivityPromptSetter({
  setActivityBecausePrompt,
  setActivityButPrompt,
  setActivitySoPrompt,
  conjunction
}) {
  let updatePrompt;
  switch(conjunction) {
    case BECAUSE:
      updatePrompt = setActivityBecausePrompt;
      break;
    case BUT:
      updatePrompt = setActivityButPrompt;
      break;
    case SO:
      updatePrompt = setActivitySoPrompt;
      break;
    default:
      updatePrompt;
  }
  return updatePrompt;
};

export function getPromptForActivitySession(sessionData: any, conjunction: string) {
  if(!sessionData) {
    return null;
  }
  const { activitySession } = sessionData;
  const { prompts } = activitySession;
  if(prompts[conjunction]) {
    const prompt = prompts[conjunction];
    prompt.conjunction = conjunction;
    return prompt;
  }
  return {
    conjunction,
    text: 'none'
  }
}

export const trimmedPrompt = (prompt: PromptInterface) => {
  const newPrompt = {...prompt};
  newPrompt.text = prompt.text.trim();
  return newPrompt;
}
