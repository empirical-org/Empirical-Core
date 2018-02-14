import $ from 'jquery';

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

export const toggleDropdown = () => {
  return { type: 'TOGGLE_DROPDOWN' };
};

export const hideDropdown = () => {
  return { type: 'HIDE_DROPDOWN' };
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
    $.ajax({
      url: '/students_classrooms_json',
      format: 'json',
      success: (data) => {
        dispatch(receiveStudentsClassrooms(data.classrooms))
      }
    });
  };
};
