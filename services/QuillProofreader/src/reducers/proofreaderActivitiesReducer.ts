import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";
import { ProofreaderActivity } from '../interfaces/proofreaderActivities'

export interface ProofreaderActivityState {
  hasreceiveddata: boolean;
  currentActivity: ProofreaderActivity;
  error?: string;
}

type ProofreaderActivityAction = Action & { data: ProofreaderActivity }

export default (
    currentState = {hasreceiveddata: false},
    action: ProofreaderActivityAction,
) => {
    switch (action.type) {
        case ActionTypes.RECEIVE_PROOFREADER_ACTIVITY_DATA:
            return Object.assign({}, currentState, { currentActivity: action.data }, {hasreceiveddata: true});
        case ActionTypes.NO_PROOFREADER_ACTIVITY_FOUND:
            return Object.assign({}, currentState, { error: 'No activity found.'})
        default:
            return currentState;
    }
};
