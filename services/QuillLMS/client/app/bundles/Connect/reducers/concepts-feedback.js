import C from '../constants';
import _ from 'lodash';

const initialState = {
  conceptsFeedback: {
    hasreceiveddata: false,
    submittingnew: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {} // this will contain firebase data
  }
}

export default function(currentstate,action){
  let newstate;
  switch(action.type){
    case C.RECEIVE_CONCEPTS_FEEDBACK_DATA:
      return Object.assign({},currentstate,{
        hasreceiveddata: true,
        data: action.data
      });
    case C.RECEIVE_CONCEPT_FEEDBACK_DATA:
      return Object.assign({}, currentstate, {
        data: Object.assign({}, currentstate.data, {
          [action.uid]: action.data,
        })
      });
    case C.AWAIT_NEW_CONCEPTS_FEEDBACK_RESPONSE:
      return Object.assign({},currentstate,{
        submittingnew: true
      });
    case C.RECEIVE_NEW_CONCEPTS_FEEDBACK_RESPONSE:
      return Object.assign({},currentstate,{
        submittingnew: false,
        newConceptModalOpen: false
      });
    case C.START_CONCEPTS_FEEDBACK_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.cid] = C.START_CONCEPTS_FEEDBACK_EDIT;
      return newstate;
    case C.FINISH_CONCEPTS_FEEDBACK_EDIT:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.cid];
      return newstate;
    case C.SUBMIT_CONCEPTS_FEEDBACK_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.cid] = C.SUBMITTING_CONCEPTS_FEEDBACK;
      return newstate;
    case C.TOGGLE_NEW_CONCEPTS_FEEDBACK_MODAL:
      return Object.assign({},currentstate,{
        newConceptModalOpen: !currentstate.newConceptModalOpen
      });
    default: return currentstate || initialState.conceptsFeedback;
  }
};
