import C from '../constants';

module.exports = {
  addResponseToMassEditArray: function(key) {
    return { type: C.ADD_RESPONSE_TO_MASS_EDIT_ARRAY, responseKey: key };
  },
  removeResponseFromMassEditArray: function(key) {
    return { type: C.REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY, responseKey: key };
  },
  clearResponsesFromMassEditArray: function() {
    return { type: C.CLEAR_RESPONSES_FROM_MASS_EDIT_ARRAY }
  }
}
