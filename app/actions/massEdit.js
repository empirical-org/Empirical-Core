import C from '../constants';

module.exports = {
  addResponseToMassEditArray: function(responseKey) {
    return { type: C.ADD_RESPONSE_TO_MASS_EDIT_ARRAY, data: { responseKey, }, };
  },
  removeResponseFromMassEditArray: function(responseKey) {
    return { type: C.REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY, data: { responseKey, }, };
  },
  clearResponsesFromMassEditArray: function() {
    return { type: C.CLEAR_RESPONSES_FROM_MASS_EDIT_ARRAY, data: {} }
  }
}
