const initialState = {
  loading: true,
  errors: false,
  selectedClassroom: 'All Classrooms',
  selectedSchool: 'All Schools',
  selectedTeacher: 'All Teachers',
  classroomsData: [],
};

function updateObject(oldObject, newObject) {
  return Object.assign({}, oldObject, newObject);
}

export default (state, action) => {
  state = state || initialState;

  switch(action.type) {
    case 'SWITCH_SCHOOL':
      return updateObject(state, {
        selectedSchool: action.school,
        selectedTeacher: 'All Teachers',
        selectedClassroom: 'All Classrooms',
      });
    case 'SWITCH_TEACHER':
      return updateObject(state, {
        selectedTeacher: action.teacher,
        selectedClassroom: 'All Classrooms',
      });
    case 'SWITCH_CLASSROOM':
      return updateObject(state, {
        selectedClassroom: action.classroom,
      });
    default:
      return state;
  }
};
