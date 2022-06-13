import { Action } from "redux";
import ActionTypes from '../constants';
import _ from 'lodash';
import { FillInBlank } from '../interfaces/fillInBlank';

export interface FillInBlankReducerState {
  data: { [key:string]: FillInBlank },
  hasreceiveddata: boolean,
  newConceptModelOpen?: boolean,
  states: { [key: string]: string },
  submittingnew: boolean,
}

type FillInBlankReducerAction = Action & { data: FillInBlank, qid: string, uid: string }

const initialState = {
  data: {},
  hasreceiveddata: false,
  newConceptModalOpen: false,
  states: {},
  submittingnew: false,
};

export default (
  currentState = initialState,
  action: FillInBlankReducerAction,
) => {
  let newState: FillInBlankReducerState;
  switch (action.type) {
    case ActionTypes.RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA:
      return Object.assign({}, currentState, {
        hasreceiveddata: true,
        data: action.data,
      });
    case ActionTypes.RECEIVE_FILL_IN_BLANK_QUESTION_DATA:
      return Object.assign({},currentState,{
        data: Object.assign({}, currentState.data, {
          [action.uid]: action.data
        })
      });
    case ActionTypes.AWAIT_NEW_FILL_IN_BLANK_QUESTION_RESPONSE:
      return Object.assign({}, currentState, {
        submittingnew: true,
      });
    case ActionTypes.RECEIVE_NEW_FILL_IN_BLANK_QUESTION_RESPONSE:
      return Object.assign({}, currentState, {
        submittingnew: false,
        newConceptModalOpen: false,
      });
    case ActionTypes.START_FILL_IN_BLANK_QUESTION_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.qid] = ActionTypes.EDITING_FILL_IN_BLANK_QUESTION;
      return newState;
    case ActionTypes.FINISH_FILL_IN_BLANK_QUESTION_EDIT:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.qid];
      return newState;
    case ActionTypes.SUBMIT_FILL_IN_BLANK_QUESTION_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.qid] = ActionTypes.SUBMITTING_FILL_IN_BLANK_QUESTION;
      return newState;
    case ActionTypes.TOGGLE_NEW_FILL_IN_BLANK_QUESTION_MODAL:
      return Object.assign({}, currentState, {
        newConceptModalOpen: !currentState.newConceptModalOpen,
      });
    default: return currentState || initialState;
  }
}
