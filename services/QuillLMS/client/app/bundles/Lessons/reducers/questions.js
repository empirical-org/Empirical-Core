import _ from 'lodash';
import C from '../constants';

const initialState = {
  questions: {
    hasreceiveddata: false,
    submittingnew: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {}, // this will contain firebase data,
  },
};

export default function (currentstate, action) {
  let newstate;
  switch (action.type) {
    case C.RECEIVE_QUESTIONS_DATA:
      return Object.assign({}, currentstate, {
        hasreceiveddata: true,
        data: action.data,
      });
    case C.AWAIT_NEW_QUESTION_RESPONSE:
      return Object.assign({}, currentstate, {
        submittingnew: true,
      });
    case C.RECEIVE_NEW_QUESTION_RESPONSE:
      return Object.assign({}, currentstate, {
        submittingnew: false,
        newConceptModalOpen: false,
      });
    case C.START_QUESTION_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = C.EDITING_QUESTION;
      return newstate;
    case C.FINISH_QUESTION_EDIT:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.qid];
      return newstate;
    case C.SUBMIT_QUESTION_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = C.SUBMITTING_QUESTION;
      return newstate;
    case C.TOGGLE_NEW_QUESTION_MODAL:
      return Object.assign({}, currentstate, {
        newConceptModalOpen: !currentstate.newConceptModalOpen,
      });
    case C.START_RESPONSE_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = `${C.START_RESPONSE_EDIT}_${action.rid}`;
      return newstate;
    case C.FINISH_RESPONSE_EDIT:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.qid];
      return newstate;
    case C.START_CHILD_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = `${C.START_CHILD_RESPONSE_VIEW}_${action.rid}`;
      return newstate;
    case C.CANCEL_CHILD_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.qid];
      return newstate;
    case C.START_FROM_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = `${C.START_FROM_RESPONSE_VIEW}_${action.rid}`;
      return newstate;
    case C.CANCEL_FROM_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.qid];
      return newstate;
    case C.START_TO_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = `${C.START_TO_RESPONSE_VIEW}_${action.rid}`;
      return newstate;
    case C.CANCEL_TO_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.qid];
      return newstate;
    case C.SUBMIT_RESPONSE_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = C.SUBMITTING_RESPONSE;
      return newstate;
    case C.SHOULD_RELOAD_RESPONSES:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = C.SHOULD_RELOAD_RESPONSES;
      return newstate;
    case C.CLEAR_QUESTION_STATE:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.qid];
      return newstate;
    default: return currentstate || initialState.questions;
  }
}
