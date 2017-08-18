import C from '../constants';
import _ from 'lodash';

const initialState = {
  lesson: {
    hasreceiveddata: false,
    submittingnew: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {}, // this will contain firebase data
    error: '',
  },
};

export default function (currentstate, action) {
  let newstate;
  switch (action.type) {
    case C.RECEIVE_CLASSROOM_LESSON_DATA:
      console.log('Updating');
      return Object.assign({}, currentstate, {
        hasreceiveddata: true,
        data: action.data,
      });
    case C.TOGGLE_HEADERS:
      return Object.assign({}, currentstate, {
        onlyShowHeaders: !currentstate.onlyShowHeaders,
      });
    case C.NO_LESSON_ID:
      newstate = Object.assign({}, currentstate, {
        error: `No such lesson. Lesson with id '${action.data}' does not exist.`,
      });
      return newstate;
    default: return currentstate || initialState.lesson;
  }
}
