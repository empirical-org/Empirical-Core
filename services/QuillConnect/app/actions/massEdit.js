import C from '../constants';

export default {
  addResponsesToMassEditArray: function(keys) {
    return { type: C.ADD_RESPONSES_TO_MASS_EDIT_ARRAY, keys };
  },
  addResponseToMassEditArray: function(key) {
    return { type: C.ADD_RESPONSE_TO_MASS_EDIT_ARRAY, responseKey: key };
  },
  removeResponseFromMassEditArray: function(key) {
    return { type: C.REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY, responseKey: key };
  },
  removeResponsesFromMassEditArray: function(keys) {
    return { type: C.REMOVE_RESPONSES_FROM_MASS_EDIT_ARRAY, keys };
  },
  clearResponsesFromMassEditArray: function() {
    return { type: C.CLEAR_RESPONSES_FROM_MASS_EDIT_ARRAY }
  }
}
