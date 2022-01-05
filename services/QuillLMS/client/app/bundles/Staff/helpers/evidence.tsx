import * as React from "react";
import stripHtml from "string-strip-html";

import {
  MINIMUM_READING_LEVEL,
  MAXIMUM_READING_LEVEL,
  TARGET_READING_LEVEL,
  SCORED_READING_LEVEL,
  IMAGE_LINK,
  IMAGE_ALT_TEXT,
  IMAGE_CAPTION,
  IMAGE_ATTRIBUTION,
  HIGHLIGHT_PROMPT,
  PLAGIARISM,
  FLAG
} from '../../../constants/evidence';
import { ActivityInterface, DropdownObjectInterface } from '../interfaces/evidenceInterfaces'

const quillCheckmark = `/images/green_check.svg`;
const quillX = '/images/red_x.svg';
const mainApiBaseUrl = `${process.env.DEFAULT_URL}/api/v1/`;
const evidenceBaseUrl = `${mainApiBaseUrl}evidence/`;
const fetchDefaults = require("fetch-defaults");

const headerHash = {
  headers: {
    "Accept": "application/JSON",
    "Content-Type": "application/json"
  }
}

export const apiFetch = fetchDefaults(fetch, evidenceBaseUrl, headerHash)

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

export function getActivitySessionsUrl({ activityId, pageNumber, startDate, endDate, turkSessionID, filterType }) {
  let url = `session_feedback_histories.json?page=${pageNumber}&activity_id=${activityId}`;
  url = startDate ? url + `&start_date=${startDate}` : url;
  url = endDate ? url + `&end_date=${endDate}` : url;
  url = turkSessionID ? url + `&turk_session_id=${turkSessionID}` : url;
  url = filterType ? url + `&filter_type=${filterType}` : url;
  return url;
}

export const getRuleFeedbackHistoriesUrl = ({ activityId, selectedConjunction, startDate, endDate, turkSessionID }) => {
  let url = `rule_feedback_histories?activity_id=${activityId}&conjunction=${selectedConjunction}`;
  url = startDate ? url + `&start_date=${startDate}` : url;
  url = endDate ? url + `&end_date=${endDate}` : url;
  url = turkSessionID ? url + `&turk_session_id=${turkSessionID}` : url;
  return url;
}

export const getRuleFeedbackHistoryUrl = ({ ruleUID, promptId, startDate, endDate, turkSessionID }) => {
  let url = `rule_feedback_history/${ruleUID}?prompt_id=${promptId}`;
  url = startDate ? url + `&start_date=${startDate}` : url;
  url = endDate ? url + `&end_date=${endDate}` : url;
  url = turkSessionID ? url + `&turk_session_id=${turkSessionID}` : url;
  return url;
};

export const getActivityStatsUrl = ({ activityId, startDate, endDate, turkSessionID }) => {
  let url = `prompt_health?activity_id=${activityId}`;
  url = startDate ? url + `&start_date=${startDate}` : url;
  url = endDate ? url + `&end_date=${endDate}` : url;
  url = turkSessionID ? url + `&turk_session_id=${turkSessionID}` : url;
  return url;
};

export const getCheckIcon = (value: boolean) => {
  if(value) {
    return (<img alt="quill-circle-checkmark" src={quillCheckmark} />)
  } else {
    return (<img alt="quill-circle-checkmark" src={quillX} />);
  }
}

export const buildActivity = ({
  activityFlag,
  activityNotes,
  activityTitle,
  activityScoredReadingLevel,
  activityTargetReadingLevel,
  activityParentActivityId,
  activityPassages,
  activityMaxFeedback,
  activityBecausePrompt,
  activityButPrompt,
  activitySoPrompt,
  highlightPrompt,
}) => {
  const prompts = [activityBecausePrompt, activityButPrompt, activitySoPrompt];
  const maxFeedback = activityMaxFeedback || 'Nice effort! You worked hard to make your sentence stronger.';
  prompts.forEach(prompt => prompt.max_attempts_feedback = maxFeedback);
  return {
    activity: {
      notes: activityNotes,
      title: activityTitle,
      parent_activity_id: activityParentActivityId ? parseInt(activityParentActivityId) : null,
      flag: activityFlag,
      scored_level: activityScoredReadingLevel,
      target_level: parseInt(activityTargetReadingLevel),
      highlight_prompt: highlightPrompt,
      passages_attributes: activityPassages,
      prompts_attributes: prompts
    }
  };
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

export const handlePageFilterClick = ({
  startDate,
  endDate,
  turkSessionID,
  filterOption,
  setStartDate,
  setEndDate,
  setShowError,
  setPageNumber,
  setTurkSessionIDForQuery,
  setFilterOptionForQuery,
  storageKey }: {
    startDate: Date,
    endDate?: Date,
    filterOption?: DropdownObjectInterface,
    turkSessionID?: string,
    setStartDate: (startDate: string) => void,
    setEndDate: (endDate: string) => void,
    setTurkSessionIDForQuery?: (turkSessionID: string) => void,
    setFilterOptionForQuery?: (filterOption: DropdownObjectInterface) => void,
    setShowError: (showError: boolean) => void,
    setPageNumber: (pageNumber: DropdownObjectInterface) => void,
    storageKey: string,
  }) => {
  if(!startDate) {
    setShowError(true);
    return;
  }
  setShowError(false);
  setPageNumber && setPageNumber({ value: '1', label: "Page 1" })
  const startDateString = startDate.toISOString();
  window.sessionStorage.setItem(`${storageKey}startDate`, startDateString);
  setStartDate(startDateString);
  if(!endDate) {
    // reset to null when user has cleared endDate value
    setEndDate(null);
  } else if(endDate)  {
    const endDateString = endDate.toISOString();
    window.sessionStorage.setItem(`${storageKey}endDate`, endDateString);
    setEndDate(endDateString);
  }
  if(turkSessionID === '') {
    // reset to null so backend doesn't check on empty string
    setTurkSessionIDForQuery(null);
  } else if(turkSessionID) {
    window.sessionStorage.setItem(`${storageKey}turkSessionId`, turkSessionID);
    setTurkSessionIDForQuery(turkSessionID);
  }
  if(filterOption) {
    window.sessionStorage.setItem(`${storageKey}filterOption`, JSON.stringify(filterOption));
    setFilterOptionForQuery(filterOption);
  }
}

export const validateForm = (keys: string[], state: any[], ruleType?: string) => {
  let errors = {};
  state.map((value, i) => {
    switch(keys[i]) {
      case IMAGE_LINK:
      case IMAGE_ALT_TEXT:
      case IMAGE_CAPTION:
      case IMAGE_ATTRIBUTION:
      case HIGHLIGHT_PROMPT:
      case FLAG:
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
