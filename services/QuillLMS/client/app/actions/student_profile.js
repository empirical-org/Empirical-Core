import request from 'request';

export const receiveStudentProfile = data => ({
  type: 'RECEIVE_STUDENT_PROFILE',
  data
})

export const fetchNotifications = () => {
  return (dispatch) => {
    request.get({
      url: "https://quill-lms-sprint-docker.herokuapp.com/notifications"
    },
    (e, r, body) => {
      const parsedBody = JSON.parse(body)
      dispatch(receiveNotifications(parsedBody))
    });
  }
}

export const fetchStudentProfile = (classroomId) => {
  return (dispatch) => {
    request.get({
      url: "https://quill-lms-sprint-docker.herokuapp.com/student_profile_data",
      qs: { current_classroom_id: classroomId, }
    },
    (e, r, body) => {
      const parsedBody = JSON.parse(body)
      dispatch(receiveStudentProfile(parsedBody))
    });
  };
};

export const toggleDropdown = () => {
  return { type: 'TOGGLE_DROPDOWN' };
};

export const hideDropdown = () => {
  return { type: 'HIDE_DROPDOWN' };
};

export const receiveNotifications = (notifications) => {
  return {
    type: 'RECEIVE_NOTIFICATIONS',
    notifications,
  }
};

export const receiveStudentsClassrooms = (classrooms) => {
  return {
    type: 'RECEIVE_STUDENTS_CLASSROOMS',
    classrooms
  };
};

export const handleClassroomClick = (selectedClassroomId) => {
  return {
    type: 'HANDLE_CLASSROOM_CLICK',
    selectedClassroomId
  };
};

export const updateNumberOfClassroomTabs = (screenWidth) => {
  return {
    type: 'UPDATE_NUMBER_OF_CLASSROOM_TABS',
    screenWidth
  };
};

export const fetchStudentsClassrooms = () => {
  return (dispatch) => {
    request.get({
      url: "https://quill-lms-sprint-docker.herokuapp.com/students_classrooms_json"
    },
    (e, r, body) => {
      const parsedBody = JSON.parse(body)
      dispatch(receiveStudentsClassrooms(parsedBody.classrooms))
    });
  };
};
