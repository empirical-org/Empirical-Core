import { ActionTypes } from './actionTypes';

export const toggleExpandSingleResponse = (rkey: string) => {
  return {type: ActionTypes.TOGGLE_EXPAND_SINGLE_RESPONSE, rkey, };
}

export const collapseAllResponses = () => {
  return {type: ActionTypes.COLLAPSE_ALL_RESPONSES, };
}

export const expandAllResponses = (expandedResponses: {[key: string]: boolean}) => {
  return {type: ActionTypes.EXPAND_ALL_RESPONSES, expandedResponses, };
}

export const toggleStatusField = (status: string) => {
  return {type: ActionTypes.TOGGLE_STATUS_FIELD, status, };
}

export const toggleResponseSort = (field: string) => {
  return {type: ActionTypes.TOGGLE_RESPONSE_SORT, field, };
}

export const toggleExcludeMisspellings = () => {
  return {type: ActionTypes.TOGGLE_EXCLUDE_MISSPELLINGS, };
}

export const resetAllFields = () => {
  return {type: ActionTypes.RESET_ALL_FIELDS, };
}

export const deselectAllFields = () => {
  return {type: ActionTypes.DESELECT_ALL_FIELDS, };
}
