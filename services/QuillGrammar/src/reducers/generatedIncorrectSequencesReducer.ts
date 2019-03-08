import _ from 'lodash';
import { ActionTypes } from "../actions/actionTypes";
import { Action } from "redux";

export interface GeneratedIncorrectSequencesReducerState {
  generatedIncorrectSequences: {
    suggested: {[key: string]: Array<string>};
    used: {[key: string]: Array<string>};
    covered: {[key: string]: Array<string>};
  }
}

type GeneratedIncorrectSequencesAction = Action & { qid: string, seq: Array<string> }

const initialState: GeneratedIncorrectSequencesReducerState = {
  generatedIncorrectSequences: {
    suggested: {},
    used: {},
    covered: {}
  }
};

export default function (currentstate: GeneratedIncorrectSequencesReducerState, action: GeneratedIncorrectSequencesAction) {
  let newstate;
  switch (action.type) {
    case ActionTypes.SET_SUGGESTED_SEQUENCES:
      newstate = _.cloneDeep(currentstate);
      newstate.suggested[action.qid] = action.seq
      return newstate;
    case ActionTypes.SET_USED_SEQUENCES:
      newstate = _.cloneDeep(currentstate);
      newstate.used[action.qid] = action.seq
      return newstate;
    case ActionTypes.SET_COVERED_SEQUENCES:
      newstate = _.cloneDeep(currentstate);
      newstate.covered[action.qid] = action.seq
      return newstate;
    default: return currentstate || initialState.generatedIncorrectSequences;
  }
}
