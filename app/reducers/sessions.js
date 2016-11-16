import C from '../constants';
import _ from 'lodash';


const initialState = {
  sessions: {
    data: {} // this will contain lesson data
  }
}

export default function(currentState, action) {
  switch (action.type) {
    case C.UPDATE_SESSION_DATA:
      let changes = {};
      changes[action.data.sessionId] = action.data.session;
      return Object.assign({}, currentState, {
        data: Object.assign({}, currentState.data, changes)}
      )
    case C.DELETE_SESSION_DATA:
      return {data: _.omit(currentState.data, action.data.sessionId)};
    case C.DELETE_ALL_SESSION_DATA:
      return {data: {}}
    default:
    return currentState || initialState.sessions;
  }
}
