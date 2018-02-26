const initialState = {
  loading: true,
  errors: false,
  selectedClassroom: 'All Classrooms',
  selectedSchool: 'All Schools',
  classroomsData: null,
  filteredClassroomsData: [],
  csvData: null,
  classroomNames: ['All Classrooms'],
  schoolNames: ['All Schools'],
};

export default (state, action) => {
  state = state || initialState;

  switch(action.type) {
    case 'SWITCH_SCHOOL':
      const filteredSchools = (selectedSchool, classroomsData) => {
        if (selectedSchool === 'All Schools') {
          return classroomsData;
        }
        return classroomsData.filter(row => row.schools_name === selectedSchool);
      };
      const filteredClassroomsData = filteredSchools(action.school, state.classroomsData);

      return Object.assign({}, state, {
        selectedSchool: action.school,
        selectedClassroom: 'All Classrooms',
        filteredClassroomsData,
        classroomNames: [...new Set(filteredClassroomsData.map(row => row.classroom_name))],
      });
    case 'SWITCH_CLASSROOM':
      const filteredClassrooms = (selectedClassroom, classroomsData) => {
        if (selectedClassroom === 'All Classrooms') {
          return classroomsData;
        }
        return classroomsData.filter(row => row.classroom_name === selectedClassroom);
      };

      return Object.assign({}, state, {
        selectedClassroom: action.classroom,
        filteredClassroomsData: filteredClassrooms(action.classroom, state.classroomsData),
      });
    case 'RECIEVE_DISTRICT_ACTIVITY_SCORES':
      const formatDataForCSV = (data) => {
        const csvData = [
          ['Classroom Name', 'Student Name', 'Average Score', 'Activity Count']
        ];
        data.forEach((row) => {
          csvData.push([
            row['classroom_name'], row['name'], (row['average_score'] * 100).toString() + '%',
            row['activity_count']
          ])
        });
        return csvData;
      };
      const classroomsData = JSON.parse(action.body).data;

      return Object.assign({}, state, {
        loading: false,
        errors: action.body.errors,
        classroomsData,
        csvData: formatDataForCSV(classroomsData),
        classroomNames: [...new Set([...state.classroomNames, ...classroomsData.map(row => row.classroom_name)])],
        filteredClassroomsData: classroomsData,
        schoolNames: [...new Set([...state.schoolNames, ...classroomsData.map(row => row.schools_name)])]
      });
    default:
      return state;
  }
};
