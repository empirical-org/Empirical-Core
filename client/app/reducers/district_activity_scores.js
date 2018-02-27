const initialState = {
  loading: true,
  errors: false,
  selectedClassroom: 'All Classrooms',
  selectedSchool: 'All Schools',
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
        selectedClassroom: 'All Classrooms',
      });
    case 'SWITCH_CLASSROOM':
      return updateObject(state, {
        selectedClassroom: action.classroom,
      });
    case 'RECIEVE_DISTRICT_ACTIVITY_SCORES':
      return updateObject(state, {
        loading: false,
        errors: action.body.errors,
        classroomsData: JSON.parse(action.body).data,
      });
    default:
      return state;
  }
};
