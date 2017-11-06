import C from '../constants';
import _ from 'lodash';

const initialState = {
  user_id: null,
  editions: {}
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
    default: return currentstate || initialState;
  }
}
