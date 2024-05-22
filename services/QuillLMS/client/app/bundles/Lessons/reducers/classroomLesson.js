import C from '../constants';

const initialState = {
  lesson: {
    hasreceiveddata: false,
    submittingnew: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {}, // this will contain firebase data
    error: '',
    id: ''
  },
};

export default function (currentstate, action) {
  let newstate;
  switch (action.type) {
    case C.RECEIVE_CLASSROOM_LESSON_DATA:
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
    case C.SET_LESSON_ID:
      return Object.assign({}, currentstate, {
        id: action.id,
      });
    case C.CLEAR_CLASSROOM_LESSON_DATA:
      return initialState.lesson
    default: return currentstate || initialState.lesson;
  }
}
