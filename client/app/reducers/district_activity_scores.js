const initialState = {
  loading: true,
  errors: false,
  selectedClassroom: 'All Classrooms',
  classroomsData: null,
  csvData: null,
  classroomNames: null,
};

export default (state, action) => {
  state = state || initialState;

  switch(action.type) {
    case 'SWITCH_CLASSROOM':
      return Object.assign({}, state, {
        selectedClassroom: action.classroom
      });
    case 'RECIEVE_DISTRICT_ACTIVITY_SCORES':
      return Object.assign({}, state, {
        loading: false,
        errors: action.errors,
        classroomsData: action.classroomsData,
        csvData: action.csvData,
        classroomNames: action.classroomNames,
      });
    default:
      return state;
  }
};
