const initialState = {
  loading: true,
  errors: false,
  selectedClassroom: 'All Classrooms',
  classroomsData: null,
  filteredClassroomsData: [],
  csvData: null,
  classroomNames: null,
  schoolNames: null,
};

export default (state, action) => {
  state = state || initialState;

  switch(action.type) {
    case 'SWITCH_CLASSROOM':
      const filteredClassrooms = (selectedClassroom, classroomsData) => {
        if (selectedClassroom === 'All Classrooms') {
          return classroomsData;
        }
        return classroomsData.filter(row => row.classroom_name === selectedClassroom);
      }

      return Object.assign({}, state, {
        selectedClassroom: action.classroom,
        filteredClassroomsData: filteredClassrooms(action.classroom, state.classroomsData),
      });
    case 'RECIEVE_DISTRICT_ACTIVITY_SCORES':
      return Object.assign({}, state, {
        loading: false,
        errors: action.errors,
        classroomsData: action.classroomsData,
        csvData: action.csvData,
        classroomNames: action.classroomNames,
        filteredClassroomsData: action.filteredClassroomsData,
        schoolNames: action.schoolNames,
      });
    default:
      return state;
  }
};
