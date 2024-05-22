import _ from 'lodash';
import { Action } from "redux";
import ActionTypes from '../constants';
import { Question } from '../interfaces/question';

export interface QuestionsReducerState {
  data: { [key:string]: Question },
  hasreceiveddata: boolean,
  states: { [key: string]: string },
  submittingnew: boolean,
}

type QuestionsReducerAction = Action & { data: Question, qid: string, rid: string, uid: string }

const initialState = {
  data: {},
  hasreceiveddata: false,
  newConceptModalOpen: false,
  states: {},
  submittingnew: false,
};

export default (
  currentState = initialState,
  action: QuestionsReducerAction,
) => {
  let newState: QuestionsReducerState;
  switch (action.type) {
    case ActionTypes.RECEIVE_QUESTIONS_DATA:
      return Object.assign({}, currentState, {
        hasreceiveddata: true,
        data: action.data,
      });
    case ActionTypes.RECEIVE_QUESTION_DATA:
      return Object.assign({}, currentState, {
        data: Object.assign({}, currentState.data, {
          [action.uid]: action.data,
        })
      });
    case ActionTypes.AWAIT_NEW_QUESTION_RESPONSE:
      return Object.assign({}, currentState, {
        submittingnew: true,
      });
    case ActionTypes.RECEIVE_NEW_QUESTION_RESPONSE:
      return Object.assign({}, currentState, {
        submittingnew: false,
        newConceptModalOpen: false,
      });
    case ActionTypes.START_QUESTION_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.qid] = ActionTypes.EDITING_QUESTION;
      return newState;
    case ActionTypes.FINISH_QUESTION_EDIT:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.qid];
      return newState;
    case ActionTypes.SUBMIT_QUESTION_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.qid] = ActionTypes.SUBMITTING_QUESTION;
      return newState;
    case ActionTypes.TOGGLE_NEW_QUESTION_MODAL:
      return Object.assign({}, currentState, {
        newConceptModalOpen: !currentState.newConceptModalOpen,
      });
    case ActionTypes.START_RESPONSE_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.qid] = `${ActionTypes.START_RESPONSE_EDIT}_${action.rid}`;
      return newState;
    case ActionTypes.FINISH_RESPONSE_EDIT:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.qid];
      return newState;
    case ActionTypes.START_CHILD_RESPONSE_VIEW:
      newState = _.cloneDeep(currentState);
      newState.states[action.qid] = `${ActionTypes.START_CHILD_RESPONSE_VIEW}_${action.rid}`;
      return newState;
    case ActionTypes.CANCEL_CHILD_RESPONSE_VIEW:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.qid];
      return newState;
    case ActionTypes.START_FROM_RESPONSE_VIEW:
      newState = _.cloneDeep(currentState);
      newState.states[action.qid] = `${ActionTypes.START_FROM_RESPONSE_VIEW}_${action.rid}`;
      return newState;
    case ActionTypes.CANCEL_FROM_RESPONSE_VIEW:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.qid];
      return newState;
    case ActionTypes.START_TO_RESPONSE_VIEW:
      newState = _.cloneDeep(currentState);
      newState.states[action.qid] = `${ActionTypes.START_TO_RESPONSE_VIEW}_${action.rid}`;
      return newState;
    case ActionTypes.CANCEL_TO_RESPONSE_VIEW:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.qid];
      return newState;
    case ActionTypes.SUBMIT_RESPONSE_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.qid] = ActionTypes.SUBMITTING_RESPONSE;
      return newState;
    case ActionTypes.SHOULD_RELOAD_RESPONSES:
      newState = _.cloneDeep(currentState);
      newState.states[action.qid] = ActionTypes.SHOULD_RELOAD_RESPONSES;
      return newState;
    case ActionTypes.CLEAR_QUESTION_STATE:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.qid];
      return newState;
    default: return currentState || initialState;
  }
}
