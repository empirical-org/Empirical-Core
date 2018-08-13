import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";
import { Questions } from '../interfaces/questions'

export interface QuestionsState {
  hasreceiveddata: boolean;
  questions: Questions
  error?: string;
}

export default (
    currentState = {hasreceiveddata: false},
    action: Action,
) => {
    switch (action.type) {
        case ActionTypes.RECEIVE_QUESTIONS_DATA:
          return Object.assign({}, currentState, { questions: action.data}, {hasreceiveddata: true})
        case ActionTypes.NO_QUESTIONS_FOUND:
            return Object.assign({}, currentState, { error: 'No questions found.'})
        default:
            return currentState;
    }
};
