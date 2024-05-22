import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";
import { Concept } from '../interfaces/concepts';

type ConceptReducerAction = Action & {data: Concept[][]}
export interface ConceptReducerState {
  hasreceiveddata: boolean;
  submittingnew: boolean;
  states: any;
  data: Concept[][]
}
const initialState = {
  concepts: {
    hasreceiveddata: false,
    submittingnew: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {} // this will contain firebase data
  }
}
export default function(currentstate: ConceptReducerState, action: ConceptReducerAction) {
  switch (action.type) {
    case ActionTypes.RECEIVE_CONCEPTS_DATA:
      return Object.assign({}, currentstate, {
        hasreceiveddata: true,
        data: action.data
      });
    default: return currentstate || initialState.concepts;
  }
};
