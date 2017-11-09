import C from '../constants';
import _ from 'lodash';

const initialState = {
  user_id: null,
  editions: {},
  workingEdition: {},
  incompleteQuestions: []
};

export default function (currentstate, action) {
  let newstate;
  switch (action.type) {
    case C.SET_USER_ID:
      return Object.assign({}, currentstate, {
        user_id: action.id,
      });
    case C.SET_EDITIONS:
      return Object.assign({}, currentstate, {
        editions: action.editions,
      });
    case C.SET_WORKING_EDITION:
      return Object.assign({}, currentstate, {
        workingEdition: action.edition,
      });
    case C.SET_INCOMPLETE_QUESTIONS:
    return Object.assign({}, currentstate, {
        incompleteQuestions: action.incompleteQuestions,
    });
    default: return currentstate || initialState;
  }
}
