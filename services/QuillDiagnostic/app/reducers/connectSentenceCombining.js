import C from '../constants';
import _ from 'lodash';

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
    default: return currentstate || initialState.questions;
  }
}
