import * as _ from 'lodash';
import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";
import { Questions } from '../interfaces/questions';

export interface QuestionsReducerState {
  hasreceiveddata: boolean;
  data?: Questions
  error?: string;
  states: { [key: string]: string };
  newConceptModalOpen: Boolean;
}

type QuestionReducerAction = Action & { data: Questions, qid: string, rid: string }

export default (
  currentState = {hasreceiveddata: false, states: {}, newConceptModalOpen: false},
  action: QuestionReducerAction,
) => {
  let newstate: QuestionsReducerState
  switch (action.type) {
    case ActionTypes.RECEIVE_QUESTIONS_DATA:
      return Object.assign({}, currentState, { data: action.data}, {hasreceiveddata: true})
    case ActionTypes.RECEIVE_SINGLE_QUESTION_DATA:
      const updatedQuestions = Object.assign({}, currentState.data, {[action.uid]: action.data})
      return Object.assign({}, currentState, {data: updatedQuestions})
    case ActionTypes.REMOVE_QUESTION_DATA:
      delete currentState[action.uid]
      return Object.assign({}, currentState)
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
      newstate = _.cloneDeep(currentState);
      newstate.states[action.qid] = ActionTypes.EDITING_QUESTION;
      return newstate;
    case ActionTypes.FINISH_QUESTION_EDIT:
      newstate = _.cloneDeep(currentState);
      delete newstate.states[action.qid];
      return newstate;
    case ActionTypes.SUBMIT_QUESTION_EDIT:
      newstate = _.cloneDeep(currentState);
      newstate.states[action.qid] = ActionTypes.SUBMITTING_QUESTION;
      return newstate;
    case ActionTypes.TOGGLE_NEW_QUESTION_MODAL:
      return Object.assign({}, currentState, {
        newConceptModalOpen: !currentState.newConceptModalOpen,
      });
    case ActionTypes.START_RESPONSE_EDIT:
      newstate = _.cloneDeep(currentState);
      newstate.states[action.qid] = `${ActionTypes.START_RESPONSE_EDIT}_${action.rid}`;
      return newstate;
    case ActionTypes.FINISH_RESPONSE_EDIT:
      newstate = _.cloneDeep(currentState);
      delete newstate.states[action.qid];
      return newstate;
    case ActionTypes.START_CHILD_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentState);
      newstate.states[action.qid] = `${ActionTypes.START_CHILD_RESPONSE_VIEW}_${action.rid}`;
      return newstate;
    case ActionTypes.CANCEL_CHILD_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentState);
      delete newstate.states[action.qid];
      return newstate;
    case ActionTypes.START_FROM_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentState);
      newstate.states[action.qid] = `${ActionTypes.START_FROM_RESPONSE_VIEW}_${action.rid}`;
      return newstate;
    case ActionTypes.CANCEL_FROM_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentState);
      delete newstate.states[action.qid];
      return newstate;
    case ActionTypes.START_TO_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentState);
      newstate.states[action.qid] = `${ActionTypes.START_TO_RESPONSE_VIEW}_${action.rid}`;
      return newstate;
    case ActionTypes.CANCEL_TO_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentState);
      delete newstate.states[action.qid];
      return newstate;
    case ActionTypes.SUBMIT_RESPONSE_EDIT:
      newstate = _.cloneDeep(currentState);
      newstate.states[action.qid] = ActionTypes.SUBMITTING_RESPONSE;
      return newstate;
    case ActionTypes.SHOULD_RELOAD_RESPONSES:
      newstate = _.cloneDeep(currentState);
      newstate.states[action.qid] = ActionTypes.SHOULD_RELOAD_RESPONSES;
      return newstate;
    case ActionTypes.CLEAR_QUESTION_STATE:
      newstate = _.cloneDeep(currentState);
      delete newstate.states[action.qid];
      return newstate;
    case ActionTypes.NO_QUESTIONS_FOUND:
      return Object.assign({}, currentState, { error: 'No questions found.'})
    default:
      return currentState;
  }
};
