import request from 'request';

export const recieveDistrictStandardsReports = (body) => {
  return { type: 'RECIEVE_DISTRICT_STANDARDS_REPORTS', body, };
};

export const switchClassroom = (classroom) => {
  return { type: 'SWITCH_CLASSROOM', classroom, };
};

export const switchSchool = (school) => {
  return { type: 'SWITCH_SCHOOL', school, };
};

export const switchTeacher = (teacher) => {
  return { type: 'SWITCH_TEACHER', teacher, };
}

export const getDistrictStandardsReports = () => {
  return (dispatch) => {
    request.get({
      url: `${process.env.DEFAULT_URL}/api/v1/progress_reports/district_standards_reports`
    },
    (e, r, body) => {
      dispatch(recieveDistrictStandardsReports(body))
    });
  }
};
