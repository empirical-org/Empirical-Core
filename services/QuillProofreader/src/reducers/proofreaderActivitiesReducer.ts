import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";
import { ProofreaderActivity, ProofreaderActivities } from '../interfaces/proofreaderActivities'

export interface ProofreaderActivityState {
  hasreceiveddata: boolean;
  currentActivity: ProofreaderActivity;
  data: ProofreaderActivities;
  error?: string;
}

type ProofreaderActivityAction = Action & { data: ProofreaderActivity }

export default (
    currentState = {hasreceiveddata: false},
    action: ProofreaderActivityAction,
    data: {}
) => {
    switch (action.type) {
        case ActionTypes.RECEIVE_PROOFREADER_ACTIVITY_DATA:
            return Object.assign({}, currentState, { currentActivity: action.data }, {hasreceiveddata: true});
        case ActionTypes.NO_PROOFREADER_ACTIVITY_FOUND:
            return Object.assign({}, currentState, { error: 'No activity found.'})
        case ActionTypes.RECEIVE_PROOFREADER_ACTIVITIES_DATA:
          return Object.assign({}, currentState, { data: action.data}, {hasreceiveddata: true})
        case ActionTypes.NO_PROOFREADER_ACTIVITIES_FOUND:
            return Object.assign({}, currentState, { error: 'No activities found.'})
        case ActionTypes.TOGGLE_NEW_LESSON_MODAL:
            return Object.assign({}, currentState, {
                newLessonModalOpen: !currentState.newLessonModalOpen
            });
        case ActionTypes.AWAIT_NEW_LESSON_RESPONSE:
            return Object.assign({}, currentState, {
                submittingnew: true
            });
        case ActionTypes.RECEIVE_NEW_LESSON_RESPONSE:
            return Object.assign({}, currentState, {
                submittingnew: false,
                newLessonModalOpen: false
            });
        default:
            return currentState;
    }
};
