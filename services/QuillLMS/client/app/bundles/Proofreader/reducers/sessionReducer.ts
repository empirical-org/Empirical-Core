import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";
import { WordObject } from '../interfaces/proofreaderActivities'

export interface SessionState {
  passage: Array<Array<WordObject>>;
  passageFromFirebase?: Array<Array<WordObject>>;
  timeTracking?: {[key:string]: number};
  error?: string;
}

type SessionAction = Action & { passage?: Array<Array<WordObject>>, timeTracking?: { [key:string]: number } }

export default (
  currentState: SessionState = { passage: [], timeTracking: {} },
  action: SessionAction,
): SessionState => {
  switch (action.type) {
    case ActionTypes.SET_FIREBASE_PASSAGE:
      return Object.assign({}, currentState, {passageFromFirebase: action.passage})
    case ActionTypes.SET_PASSAGE:
      return Object.assign({}, currentState, {passage: action.passage})
    case ActionTypes.SET_TIMETRACKING:
      return Object.assign({}, currentState, {timeTracking: action.timeTracking})
    default:
      return currentState;
  }
};
