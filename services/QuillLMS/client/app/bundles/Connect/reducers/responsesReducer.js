import Immutable from 'immutable';
import { REHYDRATE } from 'redux-persist/constants';
import C from '../constants';

const initialState = Immutable.fromJS({
  data: {},
  status: {}, // this will contain repsponse data
});

export default function (currentState, action) {
  const currentStateImm = Immutable.fromJS(currentState);
  switch (action.type) {
    case C.UPDATE_RESPONSE_DATA:
      return currentStateImm.updateIn(['data', action.data.questionId], () => action.data.responses).toJS();
    case C.DELETE_RESPONSE_DATA:
      return currentStateImm.deleteIn(['data', action.data.questionId]).toJS();
    case C.UPDATE_RESPONSE_STATUS:
      return currentStateImm.updateIn(['status', action.data.questionId], () => action.data.status).toJS();
    case C.DELETE_RESPONSE_STATUS:
      return currentStateImm.deleteIn(['status', action.data.questionId]).toJS();
    case C.DELETE_ALL_SESSION_DATA:
      return initialState.toJS();
    case 'BULK UPDATE':
      const intermediate = currentStateImm.updateIn(['data'], () => action.data.data);
      return intermediate.updateIn(['status'], () => action.data.status).toJS();
    case REHYDRATE:
      return action.payload.responses || initialState.toJS();
    default:
      const defaultState = currentStateImm || initialState;
      return defaultState.toJS();
  }
}
