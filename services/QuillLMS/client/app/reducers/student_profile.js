const initialState = {
  classrooms: null,
  selectedClassroomId: null,
  showDropdown: false,
  notifications: [],
  numberOfClassroomTabs: 1,
  loading: true,
  scores: null,
  student: null,
  nextActivitySession: null,
};

export default (state, action) => {
  const localState = state || initialState;
  const numberOfClassroomTabs = action.screenWidth > 1000 ? 5 : 1;

  switch (action.type) {
    case 'HANDLE_CLASSROOM_CLICK':
      return Object.assign({}, localState, {
        selectedClassroomId: action.selectedClassroomId,
      });
    case 'TOGGLE_DROPDOWN':
      return Object.assign({}, localState, {
        showDropdown: !localState.showDropdown,
      });
    case 'HIDE_DROPDOWN':
      return Object.assign({}, localState, { showDropdown: false, });
    case 'RECEIVE_NOTIFICATIONS':
      return Object.assign({}, localState, { notifications: action.notifications, });
    case 'RECEIVE_STUDENTS_CLASSROOMS':
      return Object.assign({}, localState, { classrooms: action.classrooms, });
    case 'RECEIVE_STUDENT_PROFILE':
      return Object.assign({}, localState, {
        loading: false,
        scores: action.data.scores,
        student: action.data.student,
        nextActivitySession: action.data.next_activity_session,
        selectedClassroomId: action.data.classroom_id,
      });
    case 'UPDATE_NUMBER_OF_CLASSROOM_TABS':
      return Object.assign({}, localState, { numberOfClassroomTabs, });
    default:
      return localState;
  }
};
