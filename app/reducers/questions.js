import C from '../constants';
import _ from 'lodash';

const initialState = {
  questions: {
    hasreceiveddata: false,
    submittingnew: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {} // this will contain firebase data
  }
}

export default function(currentstate,action){
    var newstate;
    switch(action.type){
        case C.RECEIVE_QUESTIONS_DATA:
            return Object.assign({},currentstate,{
                hasreceiveddata: true,
                data: action.data
            });
        case C.AWAIT_NEW_QUESTION_RESPONSE:
            return Object.assign({},currentstate,{
                submittingnew: true
            });
        case C.RECEIVE_NEW_QUESTION_RESPONSE:
            return Object.assign({},currentstate,{
                submittingnew: false,
                newConceptModalOpen: false
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
            return Object.assign({},currentstate,{
                newConceptModalOpen: !currentstate.newConceptModalOpen
            });
        default: return currentstate || initialState.questions;
    }
};
