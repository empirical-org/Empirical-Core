import C from '../constants';
import _ from 'lodash';

const initialState = {
  generatedIncorrectSequences: {
    suggested: {}
  }
};

export default function (currentstate, action) {
  let newstate;
  switch (action.type) {
    case C.SET_SUGGESTED_SEQUENCES:
      newstate = _.cloneDeep(currentstate);
      newstate.suggested[action.qid] = action.seq
      return newstate;
    default: return currentstate || initialState.generatedIncorrectSequences;
  }
}
