import { Action } from "redux";
import { initState } from "./rootReducer";
import { ActionTypes } from "../actions/actionTypes";

export const grammarActivities = (
    state = {},
    action: Action,
) => {
    switch (action.type) {
        case ActionTypes.RECEIVE_GRAMMAR_ACTIVITY_DATA:
            return (action as IInitStoreAction).todos;
        default:
            return state;
    }
};
