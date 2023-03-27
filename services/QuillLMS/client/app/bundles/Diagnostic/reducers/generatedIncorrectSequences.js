import _ from 'lodash';
import C from '../constants';

const initialState = {
  generatedIncorrectSequences: {
    used: {},
  }
};

export default function (currentstate, action) {
  let newstate;
  switch (action.type) {
    case C.SET_USED_SEQUENCES:
      newstate = _.cloneDeep(currentstate);
      newstate.used[action.qid] = action.seq
      return newstate;
    default: return currentstate || initialState.generatedIncorrectSequences;
  }
}
