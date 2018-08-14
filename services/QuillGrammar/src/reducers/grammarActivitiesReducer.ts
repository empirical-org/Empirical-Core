import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";
import { GrammarActivity, GrammarActivities } from '../interfaces/grammarActivities'

export interface GrammarActivityState {
  hasreceiveddata: boolean;
  currentActivity: GrammarActivity;
  data: GrammarActivities
  newLessonModalOpen: boolean
  error?: string;
}

export default (
    currentState = {hasreceiveddata: false, data: {}},
    action: Action,
) => {
    switch (action.type) {
        case ActionTypes.RECEIVE_GRAMMAR_ACTIVITIES_DATA:
          return Object.assign({}, currentState, { data: action.data}, {hasreceiveddata: true})
        case ActionTypes.RECEIVE_GRAMMAR_ACTIVITY_DATA:
            return Object.assign({}, currentState, { currentActivity: action.data}, {hasreceiveddata: true});
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
        case ActionTypes.NO_GRAMMAR_ACTIVITY_FOUND:
            return Object.assign({}, currentState, { error: 'No activity found.'})
        case ActionTypes.NO_GRAMMAR_ACTIVITIES_FOUND:
            return Object.assign({}, currentState, { error: 'No activities found.'})
        default:
            return currentState;
    }
};
