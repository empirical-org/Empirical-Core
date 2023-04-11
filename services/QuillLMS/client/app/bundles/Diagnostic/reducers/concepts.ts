import _ from 'lodash';
import { Action } from "redux";
import ActionTypes from '../constants';
import { Concept } from '../interfaces/concept';

export interface ConceptsReducerState {
    data: { [key:string]: Concept[]},
    hasreceiveddata: boolean,
    submittingnew: boolean,
    states: { [key: string]: string },
}

type ConceptsReducerAction = Action & { data: Concept, qid: string }

const initialState = {
  data: {},
  hasreceiveddata: false,
  newConceptModalOpen: false,
  states: {},
  submittingnew: false,
}

export default (
  currentState = initialState,
  action: ConceptsReducerAction,
) => {
  let newState: ConceptsReducerState;
  switch(action.type){
    case ActionTypes.RECEIVE_CONCEPTS_DATA:
      return Object.assign({},currentState,{
        hasreceiveddata: true,
        data: action.data
      });
    case ActionTypes.AWAIT_NEW_CONCEPT_RESPONSE:
      return Object.assign({},currentState,{
        submittingnew: true
      });
    case ActionTypes.RECEIVE_NEW_CONCEPT_RESPONSE:
      return Object.assign({},currentState,{
        submittingnew: false,
        newConceptModalOpen: false
      });
    case ActionTypes.START_CONCEPT_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.qid] = ActionTypes.EDITING_CONCEPT;
      return newState;
    case ActionTypes.FINISH_CONCEPT_EDIT:
      newState = _.cloneDeep(currentState);
      delete newState.states[action.qid];
      return newState;
    case ActionTypes.SUBMIT_CONCEPT_EDIT:
      newState = _.cloneDeep(currentState);
      newState.states[action.qid] = ActionTypes.SUBMITTING_CONCEPT;
      return newState;
    case ActionTypes.TOGGLE_NEW_CONCEPT_MODAL:
      return Object.assign({},currentState,{
        newConceptModalOpen: !currentState.newConceptModalOpen
      });
    default: return currentState || initialState;
  }
};
