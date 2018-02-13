const initialState = {
  classrooms: null,
  selectedClassroomId: null,
  showDropdownBoxes: false,
  classroomDisplayNumber: 1,
  loading: true,
  scores: null,
  student: null,
  nextActivitySession: null,
  screenWidth: typeof window === 'object' ? window.innerWidth : null,
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
        showDropdownBoxes: !state.showDropdownBoxes
      });
    case 'HIDE_DROPDOWN':
      return Object.assign({}, state, { showDropdownBoxes: false });
    case 'UPDATE_DEFAULT_CLASSROOM_NUMBER':
      return Object.assign({}, state, { classroomDisplayNumber });
    case 'RECEIVE_STUDENTS_CLASSROOMS':
      return Object.assign({}, state, { classrooms: action.classrooms });
    case 'RECEIVE_STUDENT_PROFILE':
      return Object.assign({}, state, {
        loading: false,
        scores: action.data.scores,
        student: action.data.student,
        nextActivitySession: action.data.next_activity_session
      });
    case 'SCREEN_RESIZE':
      const classroomDisplayNumber = action.screenWidth > 1000 ? 5 : 1;
      return Object.assign({}, state, {
        screenWidth: action.screenWidth,
        classroomDisplayNumber
      });
    default:
      return state;
  }
};
