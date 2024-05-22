import C from '../constants';

export function toggleExpandSingleResponse(rkey) {
  return {type:C.TOGGLE_EXPAND_SINGLE_RESPONSE, rkey, };
}

export function collapseAllResponses() {
  return {type:C.COLLAPSE_ALL_RESPONSES, };
}

export function expandAllResponses(expandedResponses) {
  return {type:C.EXPAND_ALL_RESPONSES, expandedResponses, };
}

export function toggleStatusField(status) {
  return {type:C.TOGGLE_STATUS_FIELD, status, };
}

export function toggleStatusFieldAndResetPage(status) {
  return {type:C.TOGGLE_STATUS_FIELD_AND_RESET_PAGE, status, };
}

export function toggleResponseSort(field) {
  return {type:C.TOGGLE_RESPONSE_SORT, field, };
}

export function toggleExcludeMisspellings() {
  return {type:C.TOGGLE_EXCLUDE_MISSPELLINGS, };
}

export function resetAllFields() {
  return {type: C.RESET_ALL_FIELDS, };
}

export function deselectAllFields() {
  return {type: C.DESELECT_ALL_FIELDS, };
}
