import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";

export interface MassEditReducerState {
  numSelectedResponses: number;
  selectedResponses: String[];
}

type MassEditAction = Action & { responseKey: string }

const initialState = {
  selectedResponses: [],
  numSelectedResponses: 0
}

export default function(currentState: MassEditReducerState, action: MassEditAction) {
  const newState = Object.assign({}, currentState || initialState);
  const responseKey = action.responseKey;
  switch (action.type) {
    case ActionTypes.ADD_RESPONSES_TO_MASS_EDIT_ARRAY:
      newState.selectedResponses = _.uniq(newState.selectedResponses.concat(action.keys))
      newState.numSelectedResponses = newState.selectedResponses.length
      return newState
    case ActionTypes.REMOVE_RESPONSES_FROM_MASS_EDIT_ARRAY:
      newState.selectedResponses = newState.selectedResponses.filter(r => !(action.keys.includes(Number(r)) || action.keys.includes(String(r))))
      newState.numSelectedResponses = newState.selectedResponses.length
      return newState;

    case ActionTypes.ADD_RESPONSE_TO_MASS_EDIT_ARRAY:
      if (newState.selectedResponses.indexOf(responseKey) < 0) {
        newState.selectedResponses.push(responseKey);
        newState.numSelectedResponses = newState.selectedResponses.length
      }
      return newState;
    case ActionTypes.REMOVE_RESPONSE_FROM_MASS_EDIT_ARRAY:
      if (newState.selectedResponses.indexOf(responseKey) > -1) {
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
