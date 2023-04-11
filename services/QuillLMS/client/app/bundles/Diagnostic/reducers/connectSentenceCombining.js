import _ from 'lodash';
import C from '../constants';

const initialState = {
  questions: {}
};

export default function (currentstate, action) {
  let newstate;
  switch (action.type) {
    case C.RECEIVE_CONNECT_QUESTIONS_DATA:
      newstate = _.cloneDeep(currentstate);
      newstate.questions = action.data
      return newstate;
    case C.SUCCESSFULLY_CLONED_CONNECT_SENTENCE_COMBINING_QUESTION:
      newstate = _.cloneDeep(currentstate);
      newstate.message = 'You have successfully cloned this Sentence Combining question!'
      return newstate
    case C.ERROR_CLONING_CONNECT_SENTENCE_COMBINING_QUESTION:
      newstate = _.cloneDeep(currentstate);
      newstate.error = 'There was a problem cloning this Sentence Combining question.'
      return newstate
    default: return currentstate || initialState.questions;
  }
}
