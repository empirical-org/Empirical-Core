import { Action } from "redux";
import ActionTypes from '../constants';
import _ from 'lodash';
import { ConceptFeedback } from '../interfaces/conceptFeedback';

export interface ConceptsFeedbackReducerState {
  data: { [key:string]: ConceptFeedback },
  hasreceiveddata: boolean,
  states: { [key: string]: string },
  submittingnew: boolean,
}

type ConceptsFeedbackReducerAction = Action & { data: ConceptFeedback, cid: string }

const initialState = {
  data: {}, 
  hasreceiveddata: false,
  newConceptModalOpen: false,
  states: {}, 
  submittingnew: false,
};

export default (
  currentState= initialState,
  action: ConceptsFeedbackReducerAction
) => {
  let newState: ConceptsFeedbackReducerState;
  switch(action.type){
    case ActionTypes.RECEIVE_CONCEPTS_FEEDBACK_DATA:
      return Object.assign({},currentState,{
        hasreceiveddata: true,
        data: action.data
      });
    case ActionTypes.AWAIT_NEW_CONCEPTS_FEEDBACK_RESPONSE:
      return Object.assign({},currentState,{
        submittingnew: true
      });
    case ActionTypes.RECEIVE_NEW_CONCEPTS_FEEDBACK_RESPONSE:
      return Object.assign({},currentState,{
        submittingnew: false,
        newConceptModalOpen: false
      });
    case ActionTypes.START_CONCEPTS_FEEDBACK_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.cid] = ActionTypes.START_CONCEPTS_FEEDBACK_EDIT;
      return newState;
    case ActionTypes.FINISH_CONCEPTS_FEEDBACK_EDIT:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.cid];
      return newState;
    case ActionTypes.SUBMIT_CONCEPTS_FEEDBACK_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.cid] = ActionTypes.SUBMITTING_CONCEPTS_FEEDBACK;
      return newState;
    case ActionTypes.TOGGLE_NEW_CONCEPTS_FEEDBACK_MODAL:
      return Object.assign({},currentState,{
        newConceptModalOpen: !currentState.newConceptModalOpen
      });
    default: return currentState || initialState;
  }
};
