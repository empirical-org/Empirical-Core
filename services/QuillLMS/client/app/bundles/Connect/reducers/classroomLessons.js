import C from '../constants';

const initialState = {
  classroomLessons: {
    hasreceiveddata: false,
    submittingnew: false,
    states: {}, // this will store per quote id if we're reading, editing or awaiting DB response
    data: {}, // this will contain firebase data
  },
};

export default function (currentstate, action) {

  let newstate;
  switch (action.type) {
    case C.RECEIVE_CLASSROOM_LESSONS_DATA:
      return Object.assign({}, currentstate, {
        hasreceiveddata: true,
        data: action.data,
      });
    default: return currentstate || initialState.classroomLessons;
  }
}
