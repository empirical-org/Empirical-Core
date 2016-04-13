var C = require("../constants").default;

module.exports = {
   toggleExpandSingleResponse: function (rkey) {
      debugger
      return {type:C.TOGGLE_EXPAND_SINGLE_RESPONSE, rkey}
   }
};