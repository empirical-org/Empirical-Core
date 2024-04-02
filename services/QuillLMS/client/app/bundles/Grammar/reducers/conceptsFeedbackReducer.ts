import * as _ from 'lodash';
import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";
import { ConceptFeedback } from '../interfaces/conceptsFeedback';

type ConceptsFeedbackAction = Action & { data: ConceptFeedback[], cid: string }

export interface ConceptsFeedbackState {
  hasreceiveddata: boolean,
  submittingnew: boolean,
  data: {[key:string]: ConceptFeedback},
  states: {[key: string]: string},
  newConceptModalOpen: boolean
}

const initialState = {
  conceptsFeedback: {
    hasreceiveddata: false,
    submittingnew: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {} // this will contain firebase data
  }
}

export default function(currentstate: ConceptsFeedbackState, action: ConceptsFeedbackAction) {
  let newstate;
  switch (action.type) {
    case ActionTypes.RECEIVE_CONCEPTS_FEEDBACK_DATA:
      return Object.assign({}, currentstate, {
        hasreceiveddata: true,
        data: action.data
      });
    case ActionTypes.AWAIT_NEW_CONCEPTS_FEEDBACK_RESPONSE:
      return Object.assign({}, currentstate, {
        submittingnew: true
      });
    case ActionTypes.RECEIVE_NEW_CONCEPTS_FEEDBACK_RESPONSE:
      return Object.assign({}, currentstate, {
        submittingnew: false,
        newConceptModalOpen: false
      });
    case ActionTypes.START_CONCEPTS_FEEDBACK_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.cid] = ActionTypes.START_CONCEPTS_FEEDBACK_EDIT;
      return newstate;
    case ActionTypes.FINISH_CONCEPTS_FEEDBACK_EDIT:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.cid];
      return newstate;
    case ActionTypes.SUBMIT_CONCEPTS_FEEDBACK_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.cid] = ActionTypes.SUBMITTING_CONCEPTS_FEEDBACK;
      return newstate;
    case ActionTypes.TOGGLE_NEW_CONCEPTS_FEEDBACK_MODAL:
      return Object.assign({}, currentstate, {
        newConceptModalOpen: !currentstate.newConceptModalOpen
      });
    default: return currentstate || initialState.conceptsFeedback;
  }
};
