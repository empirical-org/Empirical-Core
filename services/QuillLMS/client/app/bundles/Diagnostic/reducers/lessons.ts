import _ from 'lodash';
import { Action } from "redux";
import ActionTypes from '../constants';
import { Lesson } from '../interfaces/lesson';

const initialState = {
  data: {},
  hasreceiveddata: false,
  newLessonModalOpen: false,
  states: {},
  submittingnew: false,
};

export interface LessonsReducerState {
    data: { [key:string]: Lesson },
    hasreceiveddata: boolean,
    states: { [key: string]: string },
    submittingnew: boolean,
}

type LessonsReducerAction = Action & { data: Lesson, cid: string }

export default (
  currentState = initialState,
  action: LessonsReducerAction,
) => {
  let newState: LessonsReducerState;
  switch(action.type){
    case ActionTypes.RECEIVE_LESSONS_DATA:
      return Object.assign({},currentState,{
        hasreceiveddata: true,
        data: action.data
      });
    case ActionTypes.AWAIT_NEW_LESSON_RESPONSE:
      return Object.assign({},currentState,{
        submittingnew: true
      });
    case ActionTypes.RECEIVE_NEW_LESSON_RESPONSE:
      return Object.assign({},currentState,{
        submittingnew: false,
        newLessonModalOpen: false
      });
    case ActionTypes.START_LESSON_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.cid] = ActionTypes.EDITING_LESSON;
      return newState;
    case ActionTypes.FINISH_LESSON_EDIT:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.cid];
      return newState;
    case ActionTypes.SUBMIT_LESSON_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.cid] = ActionTypes.SUBMITTING_LESSON;
      return newState;
    case ActionTypes.TOGGLE_NEW_LESSON_MODAL:
      return Object.assign({},currentState,{
        newLessonModalOpen: !currentState.newLessonModalOpen
      });
    default: return currentState || initialState;
  }
};
