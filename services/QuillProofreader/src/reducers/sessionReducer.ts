import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";
import { Question } from '../interfaces/questions'

export interface SessionState {
  passage: string;
  passageFromFirebase?: string;
  error?: string;
}

export default (
    currentState: SessionState = { passage: '' },
    action: Action,
): SessionState => {
    let currentQuestion: Question|{}
    switch (action.type) {
        case ActionTypes.SET_FIREBASE_PASSAGE:
            return Object.assign({}, currentState, {passageFromFirebase: action.passage})
        case ActionTypes.SET_PASSAGE:
            return Object.assign({}, currentState, {passage: action.passage})
        default:
            return currentState;
    }
};
