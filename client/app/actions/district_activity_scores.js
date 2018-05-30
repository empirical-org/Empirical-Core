import request from 'request';

export const recieveDistrictActivityScores = (body) => {
  return { type: 'RECIEVE_DISTRICT_ACTIVITY_SCORES', body, };
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

export const getDistrictActivityScores = () => {
  return (dispatch) => {
    request.get({
      url: `${process.env.DEFAULT_URL}/api/v1/progress_reports/district_activity_scores`
    },
    (e, r, body) => {
      dispatch(recieveDistrictActivityScores(body))
    });
  }
};
