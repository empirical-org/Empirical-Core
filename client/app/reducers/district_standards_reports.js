const initialState = {
  loading: true,
  errors: false,
  selectedClassroom: 'All Classrooms',
  selectedSchool: 'All Schools',
  selectedTeacher: 'All Teachers',
  standardsReportsData: [],
  conceptReportsData: [],
  classroomsData: [],
};

function updateObject(oldObject, newObject) {
  return Object.assign({}, oldObject, newObject);
}

export default function districtStandardsReports(state = initialState, action) {
  switch(action && action.type) {
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
    case 'RECIEVE_DISTRICT_STANDARDS_REPORTS':
      return updateObject(state, {
        loading: false,
        errors: action.body.errors,
        standardsReportsData: JSON.parse(action.body).data,
      });
    default:
      return state;
  }
};
