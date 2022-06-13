import C from '../constants';
import _ from 'lodash';

const initialState = {
  lessons: {
    hasreceiveddata: false,
    submittingnew: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {} // this will contain firebase data
  }
}

export default function(currentstate,action){
  let newstate;
  switch(action.type){
    case C.RECEIVE_LESSONS_DATA:
      return Object.assign({},currentstate,{
        hasreceiveddata: true,
        data: action.data
      });
    case C.AWAIT_NEW_LESSON_RESPONSE:
      return Object.assign({},currentstate,{
        submittingnew: true
      });
    case C.RECEIVE_NEW_LESSON_RESPONSE:
      return Object.assign({},currentstate,{
        submittingnew: false,
        newLessonModalOpen: false
      });
    case C.START_LESSON_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.cid] = C.EDITING_LESSON;
      return newstate;
    case C.FINISH_LESSON_EDIT:
      newstate = _.cloneDeep(currentstate);
      delete newstate.states[action.cid];
      return newstate;
    case C.SUBMIT_LESSON_EDIT:
      newstate = _.cloneDeep(currentstate);
      newstate.states[action.cid] = C.SUBMITTING_LESSON;
      return newstate;
    case C.TOGGLE_NEW_LESSON_MODAL:
      return Object.assign({},currentstate,{
        newLessonModalOpen: !currentstate.newLessonModalOpen
      });
    default: return currentstate || initialState.lessons;
  }
};
