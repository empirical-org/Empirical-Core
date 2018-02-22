import request from 'request';

export const recieveDistrictActivityScores = (errors, classroomsData, csvData, classroomNames) => {
  return {
    type: 'RECIEVE_DISTRICT_ACTIVITY_SCORES',
    errors,
    classroomsData,
    csvData,
    classroomNames,
  };
};

export const switchClassroom = (classroom) => {
  return { type: 'SWITCH_CLASSROOM', classroom };
};

export const getDistrictActivityScores = () => {
  return (dispatch) => {
    request.get({
      url: `${process.env.DEFAULT_URL}/api/v1/progress_reports/district_activity_scores`
    },
    (e, r, body) => {
      const data = JSON.parse(body).data
      const csvData = formatDataForCSV(data)
      const classroomsData = data;
      const classroomNames = [...new Set(classroomsData.map(row => row.classroom_name))]
      classroomNames.unshift('All Classrooms');
      dispatch(recieveDistrictActivityScores(body.errors, classroomsData, csvData, classroomNames));
    });
  }
}

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
