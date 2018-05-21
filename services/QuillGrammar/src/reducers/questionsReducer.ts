import { Action } from "redux";
import { initState } from "./rootReducer";
import { ActionTypes } from "../actions/actionTypes";

export default (
    currentState = {hasreceiveddata: false, answeredQuestions: [], unansweredQuestions: [], currentQuestion: null},
    action: Action,
) => {
    switch (action.type) {
        case ActionTypes.RECEIVE_QUESTION_DATA:
            return Object.assign({}, currentState, { unansweredQuestions: action.data.slice(1), currentQuestion: action.data[0]}, {hasreceiveddata: true});
        case ActionTypes.NO_QUESTIONS_FOUND:
            return Object.assign({}, currentState, { error: 'No questions found.'})
        case ActionTypes.GO_T0_NEXT_QUESTION:
            const changes = {}
            if (currentState.currentQuestion) {
              changes.answeredQuestions = currentState.answeredQuestions.concat([currentState.currentQuestion])
            }
            changes.currentQuestion = currentState.unansweredQuestions[0]
            if (changes.currentQuestion) {
              changes.currentQuestion.attempts = []
            }
            if (currentState.unansweredQuestions.length > 0) {
              changes.unansweredQuestions = currentState.unansweredQuestions.slice(1);
            }
            return Object.assign({}, currentState, changes)
        case ActionTypes.SUBMIT_RESPONSE:
            const currentQuestion = Object.assign({}, currentState.currentQuestion)
            currentQuestion.attempts = currentQuestion.attempts ? currentQuestion.attempts.concat([action.response]) : [action.response]
            return Object.assign({}, currentState, {currentQuestion})
        default:
            return currentState;
    }
};
