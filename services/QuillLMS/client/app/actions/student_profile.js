import { requestGet, requestPost, } from '../modules/request/index';

export const receiveStudentProfile = data => ({
  type: 'RECEIVE_STUDENT_PROFILE',
  data
})

export const receiveExactScoresData = (data) => ({
  type: 'RECEIVE_EXACT_SCORES_DATA',
  data
})

export const fetchStudentProfile = (classroomId) => {
  return (dispatch) => {
    const qs = classroomId ? `?current_classroom_id=${classroomId}` : ''
    requestGet(
      `${process.env.DEFAULT_URL}/student_profile_data${qs}`,
      (body) => {
        dispatch(receiveStudentProfile(body))

        if (body.show_exact_scores) {
          dispatch(fetchExactScoresData(body.scores))
        }
      }
    );
  };
};

export const fetchExactScoresData = (scores) => {
  return (dispatch) => {
    const relevantData = scores.map(score => {
      const { ua_id, unit_id, activity_id, classroom_unit_id, } = score
      return { ua_id, unit_id, activity_id, classroom_unit_id }
    })

    // using requestPost here because params have potential to be very large
    requestPost(
      `${process.env.DEFAULT_URL}/student_exact_scores_data`,
      { data: relevantData },
      body => {
        dispatch(receiveExactScoresData(body))
      }
    )
  }
}

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

export const updateActiveClassworkTab = (activeClassworkTab) => {
  return {
    type: 'UPDATE_ACTIVE_CLASSWORK_TAB',
    activeClassworkTab
  };
};

export const fetchStudentsClassrooms = () => {
  return (dispatch) => {
    requestGet(
      `${process.env.DEFAULT_URL}/students_classrooms_json`,
      (body) => {
        dispatch(receiveStudentsClassrooms(body.classrooms))
      }
    );
  };
};
