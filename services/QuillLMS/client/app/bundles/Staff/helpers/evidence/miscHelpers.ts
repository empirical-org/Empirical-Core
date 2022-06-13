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
  FLAG,
  TEXT,
  BUILDING_ESSENTIAL_KNOWLEDGE,
  ESSENTIAL_KNOWLEDGE_TEXT_FILLER,
  MAX_ATTEMPTS_FEEDBACK,
  HIGHLIGHTING_PROMPT,
  IMAGE,
  PROMPTS,
  BREAK_TAG
} from '../../../../constants/evidence';
import { DEFAULT_HIGHLIGHT_PROMPT } from "../../../Shared";
import { DropdownObjectInterface, PromptInterface } from '../../interfaces/evidenceInterfaces'
import { getCheckIcon } from "./renderHelpers";

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
        activityPassages[0].essential_knowledge_text !== ESSENTIAL_KNOWLEDGE_TEXT_FILLER &&
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
