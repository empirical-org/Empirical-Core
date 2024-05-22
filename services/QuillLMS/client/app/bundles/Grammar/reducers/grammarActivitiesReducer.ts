import * as _ from 'lodash';
import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";
import { GrammarActivities, GrammarActivity } from '../interfaces/grammarActivities';

type GrammarActivityStateAction = Action & {cid: string, data: GrammarActivities|GrammarActivity}

export interface GrammarActivityState {
  hasreceiveddata: boolean;
  currentActivity: GrammarActivity|null;
  data: GrammarActivities
  newLessonModalOpen: boolean
  states: {[key: string]: string}
  error?: string;
}

export default (
  currentState = {hasreceiveddata: false, data: {}, states: {}, newLessonModalOpen: false, currentActivity: null},
  action: GrammarActivityStateAction,
) => {
  let newstate: GrammarActivityState
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
    case ActionTypes.START_LESSON_EDIT:
      newstate = _.cloneDeep(currentState);
      newstate.states[action.cid] = ActionTypes.EDITING_LESSON;
      return newstate;
    case ActionTypes.FINISH_LESSON_EDIT:
      newstate = _.cloneDeep(currentState);
      delete newstate.states[action.cid];
      return newstate;
    case ActionTypes.SUBMIT_LESSON_EDIT:
      newstate = _.cloneDeep(currentState);
      newstate.states[action.cid] = ActionTypes.SUBMITTING_LESSON;
      return newstate;
    case ActionTypes.START_NEW_ACTIVITY:
      return Object.assign({}, currentState, { currentActivity: null, hasreceiveddata: false })
    default:
      return currentState;
  }
};
