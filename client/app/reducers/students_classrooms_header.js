const initialState = {
  classrooms: null,
  selectedClassroomId: null,
  showDropdownBoxes: false,
  defaultClassroomNumber: 1,
};

export default (state, action) => {
  state = state || initialState;

  switch(action.type) {
    case 'HANDLE_CLASSROOM_CLICK':
      return Object.assign({}, state, { selectedClassroomId: action.selectedClassroomId });
    case 'TOGGLE_DROPDOWN':
      return Object.assign({}, state, { showDropdownBoxes: !state.showDropdownBoxes });
    case 'HIDE_DROPDOWN':
      return Object.assign({}, state, { showDropdownBoxes: false });
    case 'UPDATE_DEFAULT_CLASSROOM_NUMBER':
      const defaultClassroomNumber = action.windowInnerWidth > 1000 ? 5 : 1;
      return Object.assign({}, state, { defaultClassroomNumber });
    case 'RECEIVE_STUDENTS_CLASSROOMS':
      return Object.assign({}, state, { classrooms: action.classrooms });
    default:
      return state;
  }
};
