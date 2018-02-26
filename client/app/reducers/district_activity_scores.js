const initialState = {
  loading: true,
  errors: false,
  selectedClassroom: 'All Classrooms',
  selectedSchool: 'All Schools',
  classroomsData: [],
  filteredClassroomsData: [],
  csvData: null,
  classroomNames: ['All Classrooms'],
  schoolNames: ['All Schools'],
};

function updateObject(oldObject, newObject) {
  return Object.assign({}, oldObject, newObject);
}

function mergeArrays(firstArray, secondArray) {
  return [...new Set([...firstArray, ...secondArray])]
}

function filterByClassroom(selected, classrooms) {
  if (selected === 'All Classrooms') {
    return classrooms;
  }
  return classrooms.filter(row => row.classroom_name === selected);
}

function filterBySchool(selected, classrooms) {
  if (selected === 'All Schools') {
    return classrooms;
  }
  return classrooms.filter(row => row.schools_name === selected);
}

function formatDataForCSV(data) {
  const csvData = []
  const csvHeader = [
    'Classroom Name',
    'Student Name',
    'School Name',
    'Average Score',
    'Activity Count'
  ];
  const csvRow = (row) => [
    row['classroom_name'],
    row['students_name'],
    row['schools_name'],
    (row['average_score'] * 100).toString() + '%',
    row['activity_count'],
  ];

  csvData.push(csvHeader);
  data.forEach(row => csvData.push(csvRow(row)));

  return csvData;
};

export default (state, action) => {
  state = state || initialState;

  switch(action.type) {
    case 'SWITCH_SCHOOL':
      var filteredClassroomsData = filterBySchool(action.school, state.classroomsData);

      return updateObject(state, {
        selectedSchool: action.school,
        selectedClassroom: 'All Classrooms',
        filteredClassroomsData,
        csvData: formatDataForCSV(filteredClassroomsData),
        classroomNames: [...new Set(filteredClassroomsData.map(row => row.classroom_name))],
      });
    case 'SWITCH_CLASSROOM':
      var filteredClassroomsData = filterByClassroom(action.classroom, state.classroomsData);

      return updateObject(state, {
        selectedClassroom: action.classroom,
        filteredClassroomsData: filteredClassroomsData,
        csvData: formatDataForCSV(filteredClassroomsData),
      });
    case 'RECIEVE_DISTRICT_ACTIVITY_SCORES':
      const classroomsData = JSON.parse(action.body).data;

      return updateObject(state, {
        loading: false,
        errors: action.body.errors,
        classroomsData,
        csvData: formatDataForCSV(classroomsData),
        classroomNames: mergeArrays(state.classroomNames, classroomsData.map(row => row.classroom_name)),
        filteredClassroomsData: classroomsData,
        schoolNames: mergeArrays(state.schoolNames, classroomsData.map(row => row.schools_name)),
      });
    default:
      return state;
  }
};
