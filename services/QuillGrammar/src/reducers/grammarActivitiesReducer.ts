import { Action } from "redux";
import { initState } from "./rootReducer";
import { ActionTypes } from "../actions/actionTypes";

export default (
    currentState = {},
    action: Action,
) => {
    switch (action.type) {
        case ActionTypes.RECEIVE_GRAMMAR_ACTIVITY_DATA:
            return Object.assign({}, currentState, action.data);
        default:
            return currentState;
    }
};
