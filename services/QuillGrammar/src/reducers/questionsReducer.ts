import { Action } from "redux";
import { initState } from "./rootReducer";
import { ActionTypes } from "../actions/actionTypes";

export default (
    currentState = {hasreceiveddata: false},
    action: Action,
) => {
    switch (action.type) {
        case ActionTypes.RECEIVE_QUESTION_DATA:
            return Object.assign({}, currentState, { [action.data.concept_uid]: action.data}, {hasreceiveddata: true});
        case ActionTypes.NO_QUESTIONS_FOUND:
            return Object.assign({}, currentState, { error: 'No questions found.'})
        default:
            return currentState;
    }
};
