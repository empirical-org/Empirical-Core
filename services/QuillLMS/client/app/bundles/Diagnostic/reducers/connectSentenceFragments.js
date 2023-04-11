import _ from 'lodash';
import C from '../constants';

const initialState = {
  questions: {}
};

export default function (currentstate, action) {
  let newstate;
  switch (action.type) {
    case C.RECEIVE_CONNECT_SENTENCE_FRAGMENT_DATA:
      newstate = _.cloneDeep(currentstate);
      newstate.questions = action ? action.data : {}
      return newstate;
    case C.SUCCESSFULLY_CLONED_CONNECT_SENTENCE_FRAGMENT:
      newstate = _.cloneDeep(currentstate);
      newstate.message = 'You have successfully cloned this Sentence Fragment!'
      return newstate
    case C.ERROR_CLONING_CONNECT_SENTENCE_FRAGMENT:
      newstate = _.cloneDeep(currentstate);
      newstate.error = 'There was a problem cloning this Sentence Fragment.'
      return newstate
    default: return currentstate || initialState.questions;
  }
}
