import { Action } from "redux";
import ActionTypes from '../constants';
import _ from 'lodash';
import { SentenceFragment } from '../interfaces/SentenceFragment';

export interface SentenceFragmentsReducerState {
    data: { [key: string]: SentenceFragment },
    hasreceiveddata: boolean,
    states: { [key: string]: string },
    submittingnew: boolean,
}

type SentenceFragmentsReducerAction = Action & { data: SentenceFragment, sfid: string, rid: string, uid: string }

const initialState = {
  data: {},
  hasreceiveddata: false,
  newSentenceFragmentModalOpen: false,
  states: {},
  submittingnew: false,
};

export default (
  currentState = initialState,
  action: SentenceFragmentsReducerAction,
) => {
  let newState: SentenceFragmentsReducerState;
  switch(action.type){
    case ActionTypes.RECEIVE_SENTENCE_FRAGMENTS_DATA:
      return Object.assign({},currentState,{
        hasreceiveddata: true,
        data: action.data
      });
    case ActionTypes.RECEIVE_SENTENCE_FRAGMENT_DATA:
      return Object.assign({},currentState,{
        data: Object.assign({}, currentState.data, {
          [action.uid]: action.data
        })
      });
    case ActionTypes.AWAIT_NEW_SENTENCE_FRAGMENT_RESPONSE:
      return Object.assign({},currentState,{
        submittingnew: true
      });
    case ActionTypes.RECEIVE_NEW_SENTENCE_FRAGMENT_RESPONSE:
      return Object.assign({},currentState,{
        submittingnew: false,
        newSentenceFragmentModalOpen: false
      });
    case ActionTypes.START_SENTENCE_FRAGMENT_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.sfid] = ActionTypes.EDITING_SENTENCE_FRAGMENT;
      return newState;
    case ActionTypes.FINISH_SENTENCE_FRAGMENT_EDIT:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.sfid];
      return newState;
    case ActionTypes.SUBMIT_SENTENCE_FRAGMENT_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.sfid] = ActionTypes.SUBMITTING_SENTENCE_FRAGMENT;
      return newState;
    case ActionTypes.TOGGLE_NEW_SENTENCE_FRAGMENT_MODAL:
      return Object.assign({},currentState,{
        newSentenceFragmentModalOpen: !currentState.newSentenceFragmentModalOpen
      });
    case ActionTypes.START_RESPONSE_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.sfid] = ActionTypes.START_RESPONSE_EDIT + "_" + action.rid;
      return newState;
    case ActionTypes.FINISH_RESPONSE_EDIT:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.sfid];
      return newState;
    case ActionTypes.START_CHILD_RESPONSE_VIEW:
      newState = _.cloneDeep(currentState);
      newState.states[action.sfid] = ActionTypes.START_CHILD_RESPONSE_VIEW + "_" + action.rid;
      return newState;
    case ActionTypes.CANCEL_CHILD_RESPONSE_VIEW:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.sfid];
      return newState;
    case ActionTypes.START_FROM_RESPONSE_VIEW:
      newState = _.cloneDeep(currentState);
      newState.states[action.sfid] = ActionTypes.START_FROM_RESPONSE_VIEW + "_" + action.rid;
      return newState;
    case ActionTypes.CANCEL_FROM_RESPONSE_VIEW:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.sfid];
      return newState;
    case ActionTypes.START_TO_RESPONSE_VIEW:
      newState = _.cloneDeep(currentState);
      newState.states[action.sfid] = ActionTypes.START_TO_RESPONSE_VIEW + "_" + action.rid;
      return newState;
    case ActionTypes.CANCEL_TO_RESPONSE_VIEW:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.sfid];
      return newState;
    case ActionTypes.SUBMIT_RESPONSE_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.sfid] = ActionTypes.SUBMITTING_RESPONSE;
      return newState;
    default: return currentState || initialState;
  }
};
