import C from '../constants';
import _ from 'lodash';

const initialState = {
  questions: {}
};

export default function (currentstate, action) {
  let newstate;
  switch (action.type) {
    case C.RECEIVE_CONNECT_FILL_IN_BLANK_DATA:
      newstate = _.cloneDeep(currentstate);
      newstate.questions = action.data
      return newstate;
    case C.SUCCESSFULLY_CLONED_CONNECT_FILL_IN_BLANK_QUESTION:
      newstate = _.cloneDeep(currentstate);
      newstate.message = 'You have successfully cloned this Fill In The Blank Question!'
      return newstate
    case C.ERROR_CLONING_CONNECT_FILL_IN_BLANK_QUESTION:
      newstate = _.cloneDeep(currentstate);
      newstate.error = 'There was a problem cloning this Fill In The Blank question.'
      return newstate
    default: return currentstate || initialState.questions;
  }
}
