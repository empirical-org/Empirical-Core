import { ActionTypes } from './actionTypes'

export const addResponseToMassEditArray = key => {
  return { type: ActionTypes.ADD_RESPONSE_TO_MASS_EDIT_ARRAY, responseKey: key };
}

export const removeResponseFromMassEditArray = key => {
  return { type: ActionTypes.REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY, responseKey: key };
}

export const clearResponsesFromMassEditArray = () => {
  return { type: ActionTypes.CLEAR_RESPONSES_FROM_MASS_EDIT_ARRAY }
}
