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
  const localState = state || initialState;

  switch (action.type) {
    case 'SWITCH_SCHOOL':
      return updateObject(localState, {
        selectedSchool: action.school,
        selectedTeacher: 'All Teachers',
        selectedClassroom: 'All Classrooms',
      });
    case 'SWITCH_TEACHER':
      return updateObject(localState, {
        selectedTeacher: action.teacher,
        selectedClassroom: 'All Classrooms',
      });
    case 'SWITCH_CLASSROOM':
      return updateObject(localState, {
        selectedClassroom: action.classroom,
      });
    default:
      return localState;
  }
};
