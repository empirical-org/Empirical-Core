import _ from 'lodash';
import C from '../constants';

const initialState = {
  diagnosticQuestions: {
    hasreceiveddata: false,
    submittingnew: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {} // this will contain firebase data
  }
}

export default function(currentstate,action){
  let newstate;
  switch(action.type){
    case C.RECEIVE_DIAGNOSTIC_QUESTIONS_DATA:
      return Object.assign({},currentstate,{
        hasreceiveddata: true,
        data: action.data
      });
    case C.AWAIT_NEW_DIAGNOSTIC_QUESTION_RESPONSE:
      return Object.assign({},currentstate,{
        submittingnew: true
      });
    case C.RECEIVE_NEW_DIAGNOSTIC_QUESTION_RESPONSE:
      return Object.assign({},currentstate,{
        submittingnew: false,
        newConceptModalOpen: false
      });
    case C.START_DIAGNOSTIC_QUESTION_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = C.EDITING_QUESTION;
      return newstate;
    case C.FINISH_DIAGNOSTIC_QUESTION_EDIT:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.qid];
      return newstate;
    case C.SUBMIT_DIAGNOSTIC_QUESTION_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = C.SUBMITTING_DIAGNOSTIC_QUESTION;
      return newstate;
    case C.TOGGLE_NEW_DIAGNOSTIC_QUESTION_MODAL:
      return Object.assign({},currentstate,{
        newConceptModalOpen: !currentstate.newConceptModalOpen
      });
    case C.START_DIAGNOSTIC_RESPONSE_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = C.START_RESPONSE_EDIT + "_" + action.rid;
      return newstate;
    case C.FINISH_DIAGNOSTIC_RESPONSE_EDIT:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.qid];
      return newstate;
    case C.START_CHILD_DIAGNOSTIC_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = C.START_CHILD_RESPONSE_VIEW + "_" + action.rid;
      return newstate;
    case C.CANCEL_CHILD_DIAGNOSTIC_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.qid];
      return newstate;
    case C.START_FROM_DIAGNOSTIC_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = C.START_FROM_RESPONSE_VIEW + "_" + action.rid;
      return newstate;
    case C.CANCEL_FROM_DIAGNOSTIC_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.qid];
      return newstate;
    case C.START_TO_DIAGNOSTIC_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = C.START_TO_DIAGNOSTIC_RESPONSE_VIEW + "_" + action.rid;
      return newstate;
    case C.CANCEL_TO_DIAGNOSTIC_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.qid];
      return newstate;
    case C.SUBMIT_DIAGNOSTIC_RESPONSE_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = C.SUBMITTING_DIAGNOSTIC_RESPONSE;
      return newstate;
    default: return currentstate || initialState.diagnosticQuestions;
  }
};
