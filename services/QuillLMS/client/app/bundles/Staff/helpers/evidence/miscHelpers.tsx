import * as React from 'react';
import stripHtml from "string-strip-html";
import moment from 'moment';
import { matchSorter } from 'match-sorter';
import { Link } from 'react-router-dom';

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
  FLAG,
  TEXT,
  BUILDING_ESSENTIAL_KNOWLEDGE,
  MAX_ATTEMPTS_FEEDBACK,
  HIGHLIGHTING_PROMPT,
  IMAGE,
  PROMPTS,
  BREAK_TAG,
  DEFAULT_MAX_ATTEMPTS,
  sessionsCSVHeaders
} from '../../../../constants/evidence';
import { DEFAULT_HIGHLIGHT_PROMPT, TextFilter, NumberFilterInput, filterNumbers, Spinner } from "../../../Shared";
import { DropdownObjectInterface, ActivitySessionInterface } from '../../interfaces/evidenceInterfaces'
import { getCheckIcon } from "./renderHelpers";

const quillCheckmark = 'https://assets.quill.org/images/icons/check-circle-small.svg';

export const buildActivity = ({
  activityFlag,
  activityNotes,
  activityTitle,
  activityParentActivityId,
  activityPassages,
  activityBecausePrompt,
  activityButPrompt,
  activitySoPrompt,
  highlightPrompt,
}) => {
  const prompts = [activityBecausePrompt, activityButPrompt, activitySoPrompt];
  return {
    activity: {
      notes: activityNotes,
      title: activityTitle,
      parent_activity_id: activityParentActivityId ? parseInt(activityParentActivityId) : null,
      flag: activityFlag,
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
  filterOption,
  versionOption,
  setStartDate,
  setEndDate,
  setPageNumber,
  setFilterOptionForQuery,
  responsesForScoring,
  setResponsesForScoringForQuery,
  storageKey }: {
    startDate: Date,
    endDate?: Date,
    versionOption?: DropdownObjectInterface,
    filterOption?: DropdownObjectInterface,
    responsesForScoring?: boolean,
    setStartDate: (startDate: string) => void,
    setEndDate: (endDate: string) => void,
    setFilterOptionForQuery?: (filterOption: DropdownObjectInterface) => void,
    setPageNumber: (pageNumber: DropdownObjectInterface) => void,
    setResponsesForScoringForQuery?: (responsesForScoringQuery: boolean) => void,
    storageKey: string,
  }) => {
  if(versionOption) {
    const { value } = versionOption
    const { start_date, end_date } = value
    setStartDate(start_date);
    setEndDate(end_date);
    window.sessionStorage.setItem(`${storageKey}versionOption`, JSON.stringify(versionOption));
  }
  if(startDate) {
    const startDateString = startDate.toISOString();
    window.sessionStorage.setItem(`${storageKey}startDate`, startDateString);
    setStartDate(startDateString);
  }
  if(endDate) {
    const endDateString = endDate.toISOString();
    window.sessionStorage.setItem(`${storageKey}endDate`, endDateString);
    setEndDate(endDateString);
  }
  if(filterOption) {
    window.sessionStorage.setItem(`${storageKey}filterOption`, JSON.stringify(filterOption));
    setFilterOptionForQuery(filterOption);
  }
  if(setPageNumber) {
    setPageNumber({ value: '1', label: "Page 1" })
  }
  if(setResponsesForScoringForQuery) {
    setResponsesForScoringForQuery(responsesForScoring)
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

export function validateFormSection({
  label,
  activityPassages,
  activityBecausePrompt,
  activityButPrompt,
  activitySoPrompt,
}) {
  switch(label) {
    case titleCase(TEXT):
      const passagePresent = activityPassages && activityPassages[0] && activityPassages[0].text && activityPassages[0].text !== BREAK_TAG;
      return getCheckIcon(passagePresent);
    case BUILDING_ESSENTIAL_KNOWLEDGE:
      const essentialKnowledgePresent = (
        activityPassages && activityPassages[0] &&
        !!activityPassages[0].essential_knowledge_text &&
        activityPassages[0].essential_knowledge_text !== BREAK_TAG
      );
      return getCheckIcon(essentialKnowledgePresent);
    case HIGHLIGHTING_PROMPT:
      const highlightingPresent = (activityPassages && activityPassages[0] && !!activityPassages[0].highlight_prompt && activityPassages[0].highlight_prompt !== DEFAULT_HIGHLIGHT_PROMPT);
      return getCheckIcon(highlightingPresent);
    case IMAGE:
      const imageDetailsPresent = (
        activityPassages &&
        activityPassages[0] &&
        !!activityPassages[0].image_link &&
        !!activityPassages[0].image_alt_text &&
        !!activityPassages[0].image_caption &&
        !!activityPassages[0].image_attribution
      );
      return getCheckIcon(imageDetailsPresent);
    case MAX_ATTEMPTS_FEEDBACK:
      const maxAttemptsFeedbackPresent = (
        activityBecausePrompt &&
        activityButPrompt &&
        activitySoPrompt &&
        !!activityBecausePrompt.max_attempts_feedback &&
        !!activityButPrompt.max_attempts_feedback &&
        !!activitySoPrompt.max_attempts_feedback &&
        activityBecausePrompt.max_attempts_feedback !== BREAK_TAG &&
        activityButPrompt.max_attempts_feedback !== BREAK_TAG &&
        activitySoPrompt.max_attempts_feedback !== BREAK_TAG
      );
      return getCheckIcon(maxAttemptsFeedbackPresent);
    case PROMPTS:
      const promptsDetailsPresent = (
        activityBecausePrompt &&
        activityButPrompt &&
        activitySoPrompt &&
        !!activityBecausePrompt.text &&
        !!activityButPrompt.text &&
        !!activitySoPrompt.text &&
        !!activityBecausePrompt.first_strong_example &&
        !!activityButPrompt.first_strong_example &&
        !!activitySoPrompt.first_strong_example &&
        !!activityBecausePrompt.second_strong_example &&
        !!activityButPrompt.second_strong_example &&
        !!activitySoPrompt.second_strong_example
      );
      return getCheckIcon(promptsDetailsPresent);
    default:
      break
  }
}

export function titleCase(string: string){
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export function getVersionOptions(activityVersionData) {
  if(!activityVersionData || !activityVersionData.changeLogs) { return };
  const { changeLogs } = activityVersionData;
  let options = changeLogs.sort((a, b) => b.start_date.localeCompare(a.start_date))
  options = options.map(changeLog => {
    const { new_value, session_count, start_date } = changeLog;
    return {
      label: `V${new_value}: ${moment(start_date).utcOffset('-0500').format('MM/DD/YY')} (${session_count})`,
      value: changeLog
    }
  });
  const showAllOption = {
    label: 'Show all',
    value: {
      start_date: options[options.length - 1].value.start_date,
      end_date: options[0].value.end_date
    }
  }
  options.push(showAllOption);
  return options;
}

export const activitySessionIndexResponseHeaders = [
  {
    Header: "Date | Time",
    accessor: "datetime",
    width: 135,
    minWidth: 135,
    disableFilters: true,
    Cell: props => props.value
  },
  {
    Header: "Session ID",
    accessor: "session_uid",
    width: 100,
    minWidth: 100,
    filterAll: true,
    filter: (rows, idArray, filterValue) => {
      return matchSorter(rows, filterValue, { keys: ['original.session_uid']})
    },
    Filter: TextFilter,
    Cell: props => props.value,
  },
  {
    Header: "Total Responses",
    accessor: "total_attempts",
    minWidth: 120,
    width: 120,
    filter: filterNumbers,
    Filter: ({ column, setFilter }) =>
      (
        <NumberFilterInput
          column={column}
          handleChange={setFilter}
          label="Filter for total responses"
        />
      ),
    Cell: props => props.value
  },
  {
    Header: "Because",
    accessor: "because_attempts",
    width: 104,
    minWidth: 104,
    filter: filterNumbers,
    Filter: ({ column, setFilter }) =>
      (
        <NumberFilterInput
          column={column}
          handleChange={setFilter}
          label="Filter for because attempts"
        />
      ),
    Cell: props => props.value
  },
  {
    Header: "But",
    accessor: "but_attempts",
    width: 104,
    minWidth: 104,
    filter: filterNumbers,
    Filter: ({ column, setFilter }) =>
      (
        <NumberFilterInput
          column={column}
          handleChange={setFilter}
          label="Filter for but attempts"
        />
      ),
    Cell: props => props.value
  },
  {
    Header: "So",
    accessor: "so_attempts",
    width: 104,
    minWidth: 104,
    filter: filterNumbers,
    Filter: ({ column, setFilter }) =>
      (
        <NumberFilterInput
          column={column}
          handleChange={setFilter}
          label="Filter for so attempts"
        />
      ),
    Cell: props => props.value
  },
  {
    Header: "Scored",
    accessor: "scored_count",
    width: 104,
    minWidth: 104,
    filter: filterNumbers,
    Filter: ({ column, setFilter }) =>
      (
        <NumberFilterInput
          column={column}
          handleChange={setFilter}
          label="Filter for scored count"
        />
      ),
    Cell: props => props.value
  },
  {
    Header: "Weak",
    accessor: "weak_count",
    width: 104,
    minWidth: 104,
    filter: filterNumbers,
    Filter: ({ column, setFilter }) =>
      (
        <NumberFilterInput
          column={column}
          handleChange={setFilter}
          label="Filter for weak count"
        />
      ),
    Cell: props => props.value
  },
  {
    Header: "Strong",
    accessor: "strong_count",
    width: 104,
    minWidth: 104,
    filter: filterNumbers,
    Filter: ({ column, setFilter }) =>
      (
        <NumberFilterInput
          column={column}
          handleChange={setFilter}
          label="Filter for strong count"
        />
      ),
    Cell: props => props.value
  },
  {
    Header: "Completed?",
    accessor: "completed",
    width: 104,
    minWidth: 110,
    disableFilters: true,
    Cell: props => props.value
  },
  {
    Header: "",
    accessor: "view_link",
    minWidth: 50,
    width: 50,
    disableFilters: true,
    Cell: props => props.value
  },
]

export function colorCodeAttemptsCount(attemptCount, isOptimal) {
  if(isOptimal) {
    return attemptCount
  }
  return <p className="sub-optimal-attempt">{attemptCount}</p>
}

export function formatSessionsData(activityId, activitySessions: ActivitySessionInterface[]) {
  return activitySessions.map(session => {
    const { start_date, session_uid, because_attempts, because_optimal, but_attempts, but_optimal, so_attempts, so_optimal, complete } = session;
    const dateObject = new Date(start_date);
    const dateTime = moment(dateObject).format("MM/DD/YY hh:mm a")
    const total = because_attempts + but_attempts + so_attempts;
    const formattedSession = {
      ...session,
      id: session_uid,
      session_uid: session_uid ? session_uid.substring(0,6) : '',
      datetime: dateTime,
      because_attempts: colorCodeAttemptsCount(because_attempts, because_optimal),
      but_attempts: colorCodeAttemptsCount(but_attempts, but_optimal),
      so_attempts: colorCodeAttemptsCount(so_attempts, so_optimal),
      total_attempts: total,
      view_link: <Link className="data-link" rel="noopener noreferrer" target="_blank" to={`/activities/${activityId}/activity-sessions/${session_uid}/overview`}>View</Link>,
      completed: complete ? <img alt="quill-circle-checkmark" src={quillCheckmark} /> : ""
    };
    return formattedSession;
  });
}

export function getCSVData(sessionsCSVData) {
  if(!sessionsCSVData || !sessionsCSVData.csvResponseData) { return [] }
  const { csvResponseData } = sessionsCSVData
  return csvResponseData.map(data => {
    const { attempt, conjunction, datetime, feedback, feedback_type, name, optimal, response, session_uid } = data;
    return {
      attempt: attempt?.toString(),
      conjunction,
      datetime,
      feedback: feedback,
      rule: `${feedback_type}: ${name}`,
      optimal: `${optimal}`,
      completed: `${optimal || attempt === DEFAULT_MAX_ATTEMPTS}`,
      response,
      session_uid
    }
  });
}

export function renderCSVDownloadButton(handleLoadCSVDataClick) {
  return <button className="quill-button fun primary contained csv-download-button" onClick={handleLoadCSVDataClick}>Email Me CSV Data</button>
}


export function addCommasToThousands(num)
{
  if (!num) return ""
  let numParts = num.toString().split(".");
  numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return numParts.join(".");
}

export function getLinkToActivity(id) {
  return `${process.env.DEFAULT_URL}/cms/evidence#/activities/${id}/settings`
}

export function getLinkToPrompt(activity_id, conjunction) {
  return `${process.env.DEFAULT_URL}/cms/evidence#/activities/${activity_id}/rules-analysis/${conjunction}?selected_rule_type=All%20Rules`
}

export function secondsToHumanReadableTime(seconds) {

  let numhours = Math.floor(((seconds % 31536000) % 86400) / 3600).toString();
  let numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60).toString();
  let numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60).toString();

  if (numhours.length === 1) numhours = "0" + numhours
  if (numminutes.length === 1) numminutes = "0" + numminutes
  if (numseconds.length === 1) numseconds = "0" + numseconds

  return numhours + ":" + numminutes + ":" + numseconds;
}
