import Immutable from 'immutable';
import { ActionTypes } from "../actions/actionTypes";

const initialState = Immutable.fromJS({
  data: {},
  status: {}, // this will contain repsponse data
});

export default function(currentState, action) {
  const currentStateImm = Immutable.fromJS(currentState);
  switch (action.type) {
    case ActionTypes.UPDATE_RESPONSE_DATA:
      return currentStateImm.updateIn(['data', action.data.questionId], () => action.data.responses).toJS();
    case ActionTypes.DELETE_RESPONSE_DATA:
      return currentStateImm.deleteIn(['data', action.data.questionId]).toJS();
    case ActionTypes.UPDATE_RESPONSE_STATUS:
      return currentStateImm.updateIn(['status', action.data.questionId], () => action.data.status).toJS();
    case ActionTypes.DELETE_RESPONSE_STATUS:
      return currentStateImm.deleteIn(['status', action.data.questionId]).toJS();
    case ActionTypes.DELETE_ALL_SESSION_DATA:
      return initialState.toJS();
    default:
      const defaultState = currentStateImm || initialState;
      return defaultState.toJS();
  }
}
