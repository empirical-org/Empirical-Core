import { Action } from "redux";

import { ActionTypes } from "../actions/actionTypes";
import { ProofreaderActivities, ProofreaderActivity } from '../interfaces/proofreaderActivities';

export interface ProofreaderActivityState {
  hasreceiveddata: boolean;
  currentActivity: ProofreaderActivity;
  data: ProofreaderActivities;
  error?: string;
  states: {[key: string]: string}
  showLessonForm?: boolean
}

type ProofreaderActivityAction = Action & { data: ProofreaderActivity } & { cid: string } & { showForm: boolean }

export default (
  currentState = { hasreceiveddata: false, states: {}, showLessonForm: false },
  action: ProofreaderActivityAction,
  data: {}
) => {
  const statesObj: {[key: string]: string} = currentState.states
  switch (action.type) {
    case ActionTypes.RECEIVE_PROOFREADER_ACTIVITY_DATA:
      return Object.assign({}, currentState, { currentActivity: action.data }, {hasreceiveddata: true});
    case ActionTypes.NO_PROOFREADER_ACTIVITY_FOUND:
      return Object.assign({}, currentState, { error: 'No activity found.'})
    case ActionTypes.RECEIVE_PROOFREADER_ACTIVITIES_DATA:
      return Object.assign({}, currentState, { data: action.data}, {hasreceiveddata: true})
    case ActionTypes.NO_PROOFREADER_ACTIVITIES_FOUND:
      return Object.assign({}, currentState, { error: 'No activities found.'})
    case ActionTypes.TOGGLE_LESSON_FORM:
      return Object.assign({}, currentState, {
        showLessonForm: action.showForm !== undefined ? action.showForm : !currentState.showLessonForm
      });
    case ActionTypes.AWAIT_NEW_LESSON_RESPONSE:
      return Object.assign({}, currentState, {
        submittingnew: true
      });
    case ActionTypes.RECEIVE_NEW_LESSON_RESPONSE:
      return Object.assign({}, currentState, {
        submittingnew: false,
        showLessonForm: false
      });
    case ActionTypes.START_LESSON_EDIT:
      statesObj[action.cid] = ActionTypes.EDITING_LESSON
      return Object.assign({}, currentState, statesObj)
    case ActionTypes.FINISH_LESSON_EDIT:
      delete statesObj[action.cid];
      return Object.assign({}, currentState, statesObj)
    case ActionTypes.SUBMIT_LESSON_EDIT:
      statesObj[action.cid] = ActionTypes.SUBMITTING_LESSON
      return Object.assign({}, currentState, statesObj)
    default:
      return currentState;
  }
};
