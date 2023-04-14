import Immutable from 'immutable';
import { REHYDRATE } from 'redux-persist/constants';
import C from '../constants';

const initialState = Immutable.fromJS({
  data: {}, // This will contain lesson data
});

export default function (currentState, action) {
  const currentStateImm = Immutable.fromJS(currentState);
  switch (action.type) {
    case C.UPDATE_SESSION_DATA:
      return currentStateImm.updateIn(['data', action.data.sessionId], () => action.data.session).toJS();
    case C.DELETE_SESSION_DATA:
      return currentStateImm.deleteIn(['data', action.data.sessionId]).toJS();
    case C.DELETE_ALL_SESSION_DATA:
      return initialState.toJS();
    case REHYDRATE:
      return action.payload.sessions || initialState.toJS();
    default:
      const defaultState = currentStateImm || initialState;
      return defaultState.toJS();
  }
}
