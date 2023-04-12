import C from '../constants';

const initialState = {
  classroomLessonsReviews: {
    hasreceiveddata: false,
    data: {}
  },
};

export default function (currentstate, action) {

  let newstate;
  switch (action.type) {
    case C.RECEIVE_CLASSROOM_LESSONS_REVIEW_DATA:
      return Object.assign({}, currentstate, {
        hasreceiveddata: true,
        data: action.data,
      });
    default: return currentstate || initialState.classroomLessonsReviews;
  }
}
