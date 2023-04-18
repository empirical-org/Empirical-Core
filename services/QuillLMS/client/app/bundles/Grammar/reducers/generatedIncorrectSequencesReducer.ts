import _ from 'lodash';
import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";

export interface GeneratedIncorrectSequencesReducerState {
  generatedIncorrectSequences: {
    used: {[key: string]: Array<string>};
  }
}

type GeneratedIncorrectSequencesAction = Action & { qid: string, seq: Array<string> }

const initialState: GeneratedIncorrectSequencesReducerState = {
  generatedIncorrectSequences: {
    used: {}
  }
};

export default function (currentstate: GeneratedIncorrectSequencesReducerState, action: GeneratedIncorrectSequencesAction) {
  let newstate;
  switch (action.type) {
    case ActionTypes.SET_USED_SEQUENCES:
      newstate = _.cloneDeep(currentstate);
      newstate.used[action.qid] = action.seq
      return newstate;
    default: return currentstate || initialState.generatedIncorrectSequences;
  }
}
