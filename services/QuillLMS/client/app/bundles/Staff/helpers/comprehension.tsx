import * as React from "react";
import stripHtml from "string-strip-html";

import {
  promptStems,
  DEFAULT_MAX_ATTEMPTS,
  BECAUSE,
  BUT,
  SO,
  MINIMUM_READING_LEVEL,
  MAXIMUM_READING_LEVEL,
  TARGET_READING_LEVEL,
  SCORED_READING_LEVEL,
  IMAGE_LINK,
  IMAGE_ALT_TEXT,
  PLAGIARISM,
  ALL
} from '../../../constants/comprehension';
import { PromptInterface, ActivityInterface } from '../interfaces/comprehensionInterfaces'

const quillCheckmark = `/images/green_check.svg`;
const quillX = '/images/red_x.svg';
const mainApiBaseUrl = `${process.env.DEFAULT_URL}/api/v1/`;
const comprehensionBaseUrl = `${mainApiBaseUrl}comprehension/`;
const fetchDefaults = require("fetch-defaults");

const headerHash = {
  headers: {
    "Accept": "application/JSON",
    "Content-Type": "application/json",
    "X-CSRF-Token": localStorage.getItem('csrfToken')
  }
}

export const apiFetch = fetchDefaults(fetch, comprehensionBaseUrl, headerHash)

export const mainApiFetch = fetchDefaults(fetch, mainApiBaseUrl, headerHash)

export const mainFetch = fetchDefaults(fetch, process.env.DEFAULT_URL, headerHash)

export function getModelsUrl(promptId: string, state: string) {
  let url = 'automl_models';
  if(promptId && !state) {
    url = url + `?prompt_id=${promptId}`;
  } else if(!promptId && state) {
    url = url + `?state=${state}`;
  } else if(promptId && state) {
    url = url + `?prompt_id=${promptId}&state=${state}`;
  }
  return url;
}

export function getActivitySessionsUrl({ activityId, pageNumber, startDate, endDate }) {
  let url = `session_feedback_histories.json?page=${pageNumber}&activity_id=${activityId}`;
  url = startDate ? url + `&start_date=${startDate}` : url;
  url = endDate ? url + `&end_date=${endDate}` : url;
  return url;
}

export const getRuleFeedbackHistoriesUrl = ({ activityId, selectedConjunction, startDate, endDate }) => {
  let url = `rule_feedback_histories?activity_id=${activityId}&conjunction=${selectedConjunction}`;
  url = startDate ? url + `&start_date=${startDate}` : url;
  url = endDate ? url + `&end_date=${endDate}` : url;
  return url;
}

export const getRuleFeedbackHistoryUrl = ({ ruleUID, promptId, startDate, endDate }) => {
  let url = `rule_feedback_history/${ruleUID}?prompt_id=${promptId}`;
  url = startDate ? url + `&start_date=${startDate}` : url;
  url = endDate ? url + `&end_date=${endDate}` : url;
  return url;
};

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

export const getCheckIcon = (value: boolean) => {
  if(value) {
    return (<img alt="quill-circle-checkmark" src={quillCheckmark} />)
  } else {
    return (<img alt="quill-circle-checkmark" src={quillX} />);
  }
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
  activityNotes,
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
  const prompts = [activityBecausePrompt, activityButPrompt, activitySoPrompt];
  const maxFeedback = activityMaxFeedback || 'Nice effort! You worked hard to make your sentence stronger.';
  prompts.forEach(prompt => prompt.max_attempts_feedback = maxFeedback);
  return {
    activity: {
      notes: activityNotes,
      title: activityTitle,
      parent_activity_id: activityParentActivityId ? parseInt(activityParentActivityId) : null,
      // flag: label,
      scored_level: activityScoredReadingLevel,
      target_level: parseInt(activityTargetReadingLevel),
      passages_attributes: activityPassages,
      prompts_attributes: prompts
    }
  };
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

export const promptsByConjunction = (prompts: PromptInterface[]) => {
  const formattedPrompts = {};
  prompts && prompts.map((prompt: PromptInterface) => formattedPrompts[prompt.conjunction] = prompt);
  return formattedPrompts;
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

export const handlePageFilterClick = ({ startDate, endDate, setStartDate, setEndDate, setShowError, setPageNumber, storageKey }) => {
  if(!startDate) {
    setShowError(true);
    return;
  }
  setShowError(false);
  setPageNumber && setPageNumber({ value: '1', label: "Page 1" })
  const startDateString = startDate.toISOString();
  window.sessionStorage.setItem(`${storageKey}startDate`, startDateString);
  setStartDate(startDateString);
  if(endDate) {
    const endDateString = endDate.toISOString();
    window.sessionStorage.setItem(`${storageKey}endDate`, endDateString);
    setEndDate(endDateString);
  }
}

export const validateForm = (keys: string[], state: any[], ruleType?: string) => {
  let errors = {};
  state.map((value, i) => {
    switch(keys[i]) {
      case IMAGE_LINK:
      case IMAGE_ALT_TEXT:
        break;
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
      case "Stem Applied":
        const stemsApplied = Object.keys(value).filter(stem => value[stem].checked);
        if(!stemsApplied.length) {
          errors[keys[i]] = 'You must select at least one stem.';
        }
        if(ruleType && ruleType === PLAGIARISM && stemsApplied.length > 1) {
          errors[keys[i]] = 'You can only select one stem.';
        }
        break;
      case "Concept UID":
        if(!value) {
          errors[keys[i]] = 'Concept UID cannot be blank. Default for plagiarism rules is "Kr8PdUfXnU0L7RrGpY4uqg"'
        }
        break;
      default:
        const strippedValue = value && stripHtml(value);
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

export const handleRequestErrors = async (errors: object) => {
  let errorsArray = [];
  if(errors) {
    Object.keys(errors).forEach(key => {
      errorsArray.push(`${key}: ${errors[key]}`);
    });
  }
  return errorsArray;
}

export function titleCase(string: string){
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export const getCsrfToken = () => {
  const token = document.querySelector('meta[name="csrf-token"]')
  if (token) { return token.getAttribute('content') }
};

export const renderIDorUID = (idOrRuleId: string | number, type: string) => {
  return(
    <section className="label-status-container">
      <p id="label-status-label">{type}</p>
      <p id="label-status">{idOrRuleId}</p>
    </section>
  );
}

export function renderErrorsContainer(formErrorsPresent: boolean, requestErrors: string[]) {
  if(formErrorsPresent) {
    return(
      <div className="error-message-container">
        <p className="all-errors-message">Please check that all fields have been completed correctly.</p>
      </div>
    );
  }
  return(
    <div className="error-message-container">
      {requestErrors.map((error, i) => {
        return <p className="all-errors-message" key={i}>{error}</p>
      })}
    </div>
  )
}

export const renderHeader = (activityData: {activity: ActivityInterface}, header: string) => {
  if(!activityData) { return }
  if(!activityData.activity) { return }
  const { activity } = activityData;
  const { title, notes } = activity;
  return(
    <section className="comprehension-page-header-container">
      <h2>{header}</h2>
      <h3>{title}</h3>
      <h4>{notes}</h4>
    </section>
  );
}
