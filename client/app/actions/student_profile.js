export const receiveStudentProfile = (data) => {
  return {
    type: 'RECEIVE_STUDENT_PROFILE',
    data: data
  };
};

export const fetchStudentProfile = (classroomId) => {
  return (dispatch) => {
    $.ajax({
      url: '/student_profile_data',
      data: { current_classroom_id: classroomId },
      format: 'json',
      success: (data) => {
        dispatch(receiveStudentProfile(data));
      }
    });
  };
};
