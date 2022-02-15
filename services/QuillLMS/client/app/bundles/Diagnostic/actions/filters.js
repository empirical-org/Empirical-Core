let C = require("../constants").default;

module.exports = {
  toggleExpandSingleResponse: function (rkey) {
    return {type:C.TOGGLE_EXPAND_SINGLE_RESPONSE, rkey, };
  },
  collapseAllResponses: function () {
    return {type:C.COLLAPSE_ALL_RESPONSES, };
  },
  expandAllResponses: function (expandedResponses) {
    return {type:C.EXPAND_ALL_RESPONSES, expandedResponses, };
  },
  toggleStatusField: function (status) {
    return {type:C.TOGGLE_STATUS_FIELD, status, };
  },
  toggleResponseSort: function (field) {
    return {type:C.TOGGLE_RESPONSE_SORT, field, };
  },
  toggleExcludeMisspellings: function () {
    return {type:C.TOGGLE_EXCLUDE_MISSPELLINGS, };
  },
  resetAllFields: function () {
    return {type: C.RESET_ALL_FIELDS, };
  },
  deselectAllFields: function() {
    return {type: C.DESELECT_ALL_FIELDS, };
  },
};
