import _ from 'lodash';
import C from '../constants';

const initialState = {
  sentenceFragments: {
    hasreceiveddata: false,
    submittingnew: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {} // this will contain firebase data
  }
}

export default function(currentstate,action){
  let newstate;
  switch(action.type){
    case C.RECEIVE_SENTENCE_FRAGMENTS_DATA:
      return Object.assign({},currentstate,{
        hasreceiveddata: true,
        data: action.data
      });
    case C.AWAIT_NEW_SENTENCE_FRAGMENT_RESPONSE:
      return Object.assign({},currentstate,{
        submittingnew: true
      });
    case C.RECEIVE_NEW_SENTENCE_FRAGMENT_RESPONSE:
      return Object.assign({},currentstate,{
        submittingnew: false,
        newSentenceFragmentModalOpen: false
      });
    case C.START_SENTENCE_FRAGMENT_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.sfid] = C.EDITING_SENTENCE_FRAGMENT;
      return newstate;
    case C.FINISH_SENTENCE_FRAGMENT_EDIT:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.sfid];
      return newstate;
    case C.SUBMIT_SENTENCE_FRAGMENT_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.sfid] = C.SUBMITTING_SENTENCE_FRAGMENT;
      return newstate;
    case C.TOGGLE_NEW_SENTENCE_FRAGMENT_MODAL:
      return Object.assign({},currentstate,{
        newSentenceFragmentModalOpen: !currentstate.newSentenceFragmentModalOpen
      });
    case C.START_RESPONSE_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.sfid] = C.START_RESPONSE_EDIT + "_" + action.rid;
      return newstate;
    case C.FINISH_RESPONSE_EDIT:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.sfid];
      return newstate;
    case C.START_CHILD_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.sfid] = C.START_CHILD_RESPONSE_VIEW + "_" + action.rid;
      return newstate;
    case C.CANCEL_CHILD_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.sfid];
      return newstate;
    case C.START_FROM_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.sfid] = C.START_FROM_RESPONSE_VIEW + "_" + action.rid;
      return newstate;
    case C.CANCEL_FROM_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.sfid];
      return newstate;
    case C.START_TO_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.sfid] = C.START_TO_RESPONSE_VIEW + "_" + action.rid;
      return newstate;
    case C.CANCEL_TO_RESPONSE_VIEW:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.sfid];
      return newstate;
    case C.SUBMIT_RESPONSE_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.sfid] = C.SUBMITTING_RESPONSE;
      return newstate;
    default: return currentstate || initialState.sentenceFragments;
  }
};
