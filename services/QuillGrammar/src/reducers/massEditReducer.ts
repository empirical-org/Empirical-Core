import { ActionTypes } from "../actions/actionTypes";
import { Action } from "redux";

export interface MassEditReducerState {
  numSelectedResponses: number;
  selectedResponses: Array<String>;
}

type MassEditAction = Action & { responseKey: string }

const initialState = {
  selectedResponses: [],
  numSelectedResponses: 0
}

export default function(currentState: MassEditReducerState, action: MassEditAction) {
  let newState = Object.assign({}, currentState || initialState);
  let responseKey = action.responseKey;
  switch(action.type) {
    case ActionTypes.ADD_RESPONSE_TO_MASS_EDIT_ARRAY:
      if(newState.selectedResponses.indexOf(responseKey) < 0) {
        newState.selectedResponses.push(responseKey);
        newState.numSelectedResponses = newState.selectedResponses.length
      }
      return newState;
    case ActionTypes.REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY:
      if(newState.selectedResponses.indexOf(responseKey) > -1) {
        newState.selectedResponses.splice(newState.selectedResponses.indexOf(responseKey), 1);
        newState.numSelectedResponses = newState.selectedResponses.length
      }
      return newState;
    case ActionTypes.CLEAR_RESPONSES_FROM_MASS_EDIT_ARRAY:
      newState.selectedResponses = [];
      newState.numSelectedResponses = 0
      return newState;
    default:
      return newState;
  }
}
