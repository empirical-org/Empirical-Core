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

export const updateDefaultClassroomNumber = (windowInnerWidth) => {
  return {
    type: 'UPDATE_DEFAULT_CLASSROOM_NUMBER',
    windowInnerWidth
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

