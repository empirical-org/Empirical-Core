import { Action } from "redux";
import { initState } from "./rootReducer";
import { ActionTypes } from "../actions/actionTypes";

export default (
    currentState = {hasreceiveddata: false, answeredQuestions: [], unansweredQuestions: [], currentQuestion: null},
    action: Action,
) => {
    switch (action.type) {
        case ActionTypes.RECEIVE_QUESTION_DATA:
            const randomIndex = [Math.floor(Math.random()*action.data.length)];
            const currentQuestion = action.data.splice(randomIndex, 1)[0]
            return Object.assign({}, currentState, { unansweredQuestions: action.data, currentQuestion: currentQuestion, hasreceiveddata: true});
        case ActionTypes.NO_QUESTIONS_FOUND:
            return Object.assign({}, currentState, { error: 'No questions found.'})
        case ActionTypes.GO_T0_NEXT_QUESTION:
            const changes = Object.assign({}, currentState)
            if (currentState.currentQuestion) {
              changes.answeredQuestions = currentState.answeredQuestions.concat([currentState.currentQuestion])
            }
            const randomIndex = [Math.floor(Math.random()*currentState.unansweredQuestions.length)];
            changes.currentQuestion = changes.unansweredQuestions.splice(randomIndex, 1)[0]
            if (changes.currentQuestion) {
              changes.currentQuestion.attempts = []
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
