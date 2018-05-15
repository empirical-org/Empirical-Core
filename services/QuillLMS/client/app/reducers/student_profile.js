const initialState = {
  classrooms: null,
  selectedClassroomId: null,
  showDropdown: false,
  numberOfClassroomTabs: 1,
  loading: true,
  scores: null,
  student: null,
  nextActivitySession: null
};

export default (state, action) => {
  state = state || initialState;

  switch(action.type) {
    case 'HANDLE_CLASSROOM_CLICK':
      return Object.assign({}, state, {
        selectedClassroomId: action.selectedClassroomId
      });
    case 'TOGGLE_DROPDOWN':
      return Object.assign({}, state, {
        showDropdown: !state.showDropdown
      });
    case 'HIDE_DROPDOWN':
      return Object.assign({}, state, { showDropdown: false });
    case 'RECEIVE_STUDENTS_CLASSROOMS':
      return Object.assign({}, state, { classrooms: action.classrooms });
    case 'RECEIVE_STUDENT_PROFILE':
      return Object.assign({}, state, {
        loading: false,
        scores: action.data.scores,
        student: action.data.student,
        nextActivitySession: action.data.next_activity_session,
        selectedClassroomId: action.data.classroom_id
      });
    case 'UPDATE_NUMBER_OF_CLASSROOM_TABS':
      const numberOfClassroomTabs = action.screenWidth > 1000 ? 5 : 1;
      return Object.assign({}, state, { numberOfClassroomTabs });
    default:
      return state;
  }
};
