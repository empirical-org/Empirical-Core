import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";
import { Question } from '../interfaces/questions'

export interface SessionState {
  hasreceiveddata: boolean;
  answeredQuestions: Question[]|never;
  unansweredQuestions: Question[]|never;
  currentQuestion: Question|null;
  error?: string;
}

export default (
    currentState: SessionState = {hasreceiveddata: false, answeredQuestions: [], unansweredQuestions: [], currentQuestion: null},
    action: Action,
): SessionState => {
    let currentQuestion: Question|{}
    switch (action.type) {
        case ActionTypes.SET_SESSION:
            return Object.assign({}, currentState, action.session)
        case ActionTypes.RECEIVE_QUESTION_DATA:
            currentQuestion = action.data.splice(0, 1)[0]
            return Object.assign({}, currentState, { unansweredQuestions: action.data, currentQuestion, hasreceiveddata: true});
        case ActionTypes.NO_QUESTIONS_FOUND:
            return Object.assign({}, currentState, { error: 'No questions found.'})
        case ActionTypes.GO_T0_NEXT_QUESTION:
            const changes: SessionState = Object.assign({}, currentState)
            if (currentState.currentQuestion) {
              changes.answeredQuestions = currentState.answeredQuestions.concat([currentState.currentQuestion])
            }
            changes.currentQuestion = changes.unansweredQuestions.splice(0, 1)[0]
            if (changes.currentQuestion) {
              changes.currentQuestion.attempts = []
            }
            return Object.assign({}, currentState, changes)
        case ActionTypes.SUBMIT_RESPONSE:
            currentQuestion = Object.assign({}, currentState.currentQuestion)
            currentQuestion.attempts = currentQuestion.attempts ? currentQuestion.attempts.concat([action.response]) : [action.response]
            return Object.assign({}, currentState, {currentQuestion})
        default:
            return currentState;
    }
};
