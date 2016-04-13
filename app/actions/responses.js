var C = require("../constants").default;

module.exports = {
   toggleExpandSingleResponse: function (rkey) {
      return {type:C.TOGGLE_EXPAND_SINGLE_RESPONSE, rkey}
   },
   collapseAllResponses: function () {
      return {type:C.COLLAPSE_ALL_RESPONSES}
   },
   expandAllResponses: function (expandedResponses) {
      return {type:C.EXPAND_ALL_RESPONSES, expandedResponses}
   },
   toggleStatusField: function (newVisibleStatuses) {
      return {type:C.TOGGLE_STATUS_FIELD, newVisibleStatuses}
   },
   toggleResponseSort: function (field) {
      return {type:C.TOGGLE_RESPONSE_SORT, field}
   }
};