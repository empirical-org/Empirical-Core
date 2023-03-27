import { ActionTypes } from './actionTypes';

export const addResponseToMassEditArray = (key: string) => {
  return { type: ActionTypes.ADD_RESPONSE_TO_MASS_EDIT_ARRAY, responseKey: key };
}

export const removeResponseFromMassEditArray = (key: string) => {
  return { type: ActionTypes.REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY, responseKey: key };
}

export const clearResponsesFromMassEditArray = () => {
  return { type: ActionTypes.CLEAR_RESPONSES_FROM_MASS_EDIT_ARRAY }
}

export const addResponsesToMassEditArray= (keys) =>  {
  return { type: ActionTypes.ADD_RESPONSES_TO_MASS_EDIT_ARRAY, keys };
}

export const removeResponsesFromMassEditArray= (keys) =>  {
  return { type: ActionTypes.REMOVE_RESPONSES_FROM_MASS_EDIT_ARRAY, keys };
}
