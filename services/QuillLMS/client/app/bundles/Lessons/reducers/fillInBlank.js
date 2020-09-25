import _ from 'lodash';

import C from '../constants';

const initialState = {
  fillInBlank: {
    hasreceiveddata: false,
    submittingnew: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {}, // this will contain firebase data
  },
};

export default function (currentstate, action) {
  let newstate;
  switch (action.type) {
    case C.RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA:
      return Object.assign({}, currentstate, {
        hasreceiveddata: true,
        data: action.data,
      });
    case C.AWAIT_NEW_FILL_IN_BLANK_QUESTION_RESPONSE:
      return Object.assign({}, currentstate, {
        submittingnew: true,
      });
    case C.RECEIVE_NEW_FILL_IN_BLANK_QUESTION_RESPONSE:
      return Object.assign({}, currentstate, {
        submittingnew: false,
        newConceptModalOpen: false,
      });
    case C.START_FILL_IN_BLANK_QUESTION_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = C.EDITING_FILL_IN_BLANK_QUESTION;
      return newstate;
    case C.FINISH_FILL_IN_BLANK_QUESTION_EDIT:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.qid];
      return newstate;
    case C.SUBMIT_FILL_IN_BLANK_QUESTION_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.qid] = C.SUBMITTING_FILL_IN_BLANK_QUESTION;
      return newstate;
    case C.TOGGLE_NEW_FILL_IN_BLANK_QUESTION_MODAL:
      return Object.assign({}, currentstate, {
        newConceptModalOpen: !currentstate.newConceptModalOpen,
      });
    default: return currentstate || initialState.fillInBlank;
  }
}
