import C from '../constants';

export default {
  addResponsesToMassEditArray(keys) {
    return { type: C.ADD_RESPONSES_TO_MASS_EDIT_ARRAY, keys, };
  },
  addResponseToMassEditArray(key) {
    return { type: C.ADD_RESPONSE_TO_MASS_EDIT_ARRAY, responseKey: key, };
  },
  removeResponseFromMassEditArray(key) {
    return { type: C.REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY, responseKey: key, };
  },
  removeResponsesFromMassEditArray(keys) {
    return { type: C.REMOVE_RESPONSES_FROM_MASS_EDIT_ARRAY, keys, };
  },
  clearResponsesFromMassEditArray() {
    return { type: C.CLEAR_RESPONSES_FROM_MASS_EDIT_ARRAY, }
  }
}
