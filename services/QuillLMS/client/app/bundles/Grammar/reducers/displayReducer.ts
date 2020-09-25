import { Action } from "redux";

import { ActionTypes } from "../actions/actionTypes";

const initialState = {
  message: '',
  error: ''
}

export interface DisplayReducerState {
  message: string;
  error: string;
}

type DisplayReducerActionType = Action & {message: string, error: string}

export default function(currentState: DisplayReducerState, action: DisplayReducerActionType) {
  const newState = Object.assign({}, currentState || initialState);
  const message = action.message
  const error = action.error
  switch (action.type) {
    case ActionTypes.DISPLAY_ERROR:
      newState.error = error
      return newState;
    case ActionTypes.DISPLAY_MESSAGE:
      newState.message = message
      return newState;
    case ActionTypes.CLEAR_DISPLAY_MESSAGE_AND_ERROR:
      newState.message = ''
      newState.error = ''
      return newState
    default:
      return newState;
  }
}
