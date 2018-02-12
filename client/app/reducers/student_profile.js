const initialState = {
  loading: true,
  scores: null,
  student: null,
  nextActivitySession: null
};

export default (state, action) => {
  state = state || initialState;

  switch(action.type) {
    case 'RECEIVE_STUDENT_PROFILE':
      return Object.assign({}, state, {
        loading: false,
        scores: action.data.scores,
        student: action.data.student,
        nextActivitySession: action.data.next_activity_session
      });
    default:
      return state;
  }
};
