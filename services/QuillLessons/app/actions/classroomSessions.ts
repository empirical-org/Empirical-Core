declare function require(name:string);
import C from '../constants';
import * as request from 'request';
import _ from 'lodash';
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList,
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
  TeacherAndClassroomName
} from '../components/classroomLessons/interfaces';
import {
 ClassroomLesson
} from '../interfaces/classroomLessons';
import * as CustomizeIntf from '../interfaces/customize';
import uuid from 'uuid/v4';
import socket from '../utils/socketStore';

export function startListeningToSession(classroomUnitId: string) {
  return function(dispatch, getState) {
    socket.instance.on(`classroomLessonSession:${classroomUnitId}`, (data) => {
      if (data) {
        if (!_.isEqual(getState().classroomSessions.data, data)) {
          dispatch(updateSession(data));
        }
      } else {
        dispatch({type: C.NO_CLASSROOM_UNIT, data: classroomUnitId})
      }
    });
    socket.instance.emit('subscribeToClassroomLessonSession', { classroomUnitId });
  };
}

export function startLesson(classroomUnitId: string, callback?: Function) {
  let url = new URL('/api/v1/classroom_units/classroom_teacher_and_coteacher_ids', process.env.EMPIRICAL_BASE_URL);
  const params = new URLSearchParams(JSON.stringify({
    classroom_unit_id: classroomUnitId
  }));
  url.search = params.toString();

  fetch(url.href, {
    method: "GET",
    mode: "cors",
    credentials: 'include',
  }).then(response => {
    if (!response.ok) {
      console.log(response.statusText)
    } else {
      return response.json()
    }
  }).then(teacherIdObject => {
    socket.instance.emit('createOrUpdateClassroomLessonSession', {
      classroomUnitId,
      teacherIdObject
    });
  })

  if (callback) {
    callback();
  }
}

export function finishActivity(
  followUp,
  conceptResults,
  editionId,
  activityId,
  classroomUnitId,
  callback?: Function
) {
  const data = JSON.stringify({
    follow_up: followUp,
    concept_results: conceptResults,
    edition_id: editionId,
    activity_id: activityId,
    classroom_unit_id: classroomUnitId,
  });

  fetch(`${process.env.EMPIRICAL_BASE_URL}/api/v1/classroom_units/finish_lesson`, {
    method: 'PUT',
    body: data,
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  }).then((response) => {
    if (callback) {
      callback(response);
    }
  }).catch((error) => {
    console.log('error', error);
  })

}

export function toggleOnlyShowHeaders() {
  return function (dispatch) {
    dispatch({type: C.TOGGLE_HEADERS})
  }
}

export function startListeningToSessionForTeacher(
  activityId: string,
  classroomUnitId: string,
) {
  return function (dispatch, getState) {
    let initialized = false;

    socket.instance.on(`classroomLessonSession:${classroomUnitId}`, (session) => {
      if (session) {

        if (!_.isEqual(getState().classroomSessions.data, session)) {
          dispatch(updateSession(session));
        }
        dispatch(getInitialData(
          activityId,
          initialized,
          session.preview,
          classroomUnitId
        ))
        initialized = true
      } else {
        dispatch({type: C.NO_CLASSROOM_UNIT, data: classroomUnitId})
      }
    });
    socket.instance.emit('subscribeToClassroomLessonSession', { classroomUnitId });
  }
}

export function getInitialData(
  activityId: string,
  initialized,
  preview,
  classroomUnitId: string,
) {
  return function(dispatch) {
    if (!initialized && classroomUnitId) {
      if (preview) {
        dispatch(getPreviewData(activityId, classroomUnitId))
      } else {
        dispatch(getLessonData(activityId, classroomUnitId))
      }
    }
  }
}

export function getLessonData(
  activityId: string,
  classroomUnitId: string,
) {
  return function(dispatch) {
    dispatch(getClassroomAndTeacherNameFromServer(classroomUnitId, process.env.EMPIRICAL_BASE_URL))
    dispatch(loadStudentNames(activityId, classroomUnitId, process.env.EMPIRICAL_BASE_URL))
    dispatch(loadFollowUpNameAndSupportingInfo(activityId, process.env.EMPIRICAL_BASE_URL, classroomUnitId))
  }
}

export function getPreviewData(
  activityId: string,
  classroomUnitId: string
) {
  const baseUrl:string = process.env.EMPIRICAL_BASE_URL ? String(process.env.EMPIRICAL_BASE_URL) : 'https://quill.org/'
  return function(dispatch) {
    dispatch(loadSupportingInfo(activityId, baseUrl, classroomUnitId))
  }
}

export function updateSession(data: object): {type: string; data: any;} {
  return {
    type: C.UPDATE_CLASSROOM_SESSION_DATA,
    data,
  };
}

export function redirectAssignedStudents(
  classroomUnitId: string,
  followUpOption: string,
  followUpUrl: string
) {
  socket.instance.emit('redirectAssignedStudents', {
    classroomUnitId,
    followUpOption,
    followUpUrl,
  })
}

export function registerPresence(
  classroomUnitId: string,
  studentId: string
): void {
  socket.instance.emit('registerPresence', { classroomUnitId, studentId });
}

export function goToNextSlide(
  state: ClassroomLessonSession,
  lesson: ClassroomLesson|CustomizeIntf.EditionQuestions,
  classroomUnitId: string|null
) {
  if (classroomUnitId) {
    const { current_slide } = state;
    const { questions } = lesson;
    const slides = questions ? Object.keys(questions) : [];
    const current_slide_index = slides.indexOf(current_slide.toString());
    const nextSlide = slides[current_slide_index + 1];
    if (nextSlide !== undefined) {
      return updateCurrentSlide(nextSlide, classroomUnitId);
    }
  }
}

export function goToPreviousSlide(
  state: ClassroomLessonSession,
  lesson: ClassroomLesson|CustomizeIntf.EditionQuestions,
  classroomUnitId: string|null
) {
  if (classroomUnitId) {
    const { current_slide } = state;
    const { questions } = lesson;
    const slides = questions ? Object.keys(questions) : [];
    const current_slide_index = slides.indexOf(current_slide.toString());
    const previousSlide = slides[current_slide_index - 1];
    if (previousSlide !== undefined) {
      return updateCurrentSlide(previousSlide, classroomUnitId);
    }
  }
}

export function updateCurrentSlide(
  question_id: string,
  classroomUnitId: string
) {
  return (dispatch) => {
    dispatch(updateSlideInStore(question_id))
    updateSlide(question_id, classroomUnitId)
  }
}

export function updateSlide(
  questionId: string,
  classroomUnitId: string
 ) {
  socket.instance.emit('updateClassroomLessonSession', {
    classroomUnitId,
    session: {
      id: classroomUnitId,
      current_slide: questionId,
    }
  });
  setSlideStartTime(classroomUnitId, questionId)
}

export function updateSlideInStore(slideId: string) {
  return{
    type: C.UPDATE_SLIDE_IN_STORE,
    data: slideId
  }
}

export function saveStudentSubmission(
  classroomUnitId: string,
  questionId: string,
  studentId: string,
  submission: {data: any}
): void {
  socket.instance.emit('saveStudentSubmission', {
    classroomUnitId,
    questionId,
    studentId,
    submission,
  });
}

export function removeStudentSubmission(
  classroomUnitId: string,
  questionId: string,
  studentId: string
): void {
  socket.instance.emit('removeStudentSubmission', {
    classroomUnitId,
    questionId,
    studentId,
  })
}

export function clearAllSubmissions(
  classroomUnitId: string,
  questionId: string
): void {
  socket.instance.emit('clearAllSubmissions', {
    classroomUnitId,
    questionId,
  });
}

export function saveSelectedStudentSubmission(
  classroomUnitId: string,
  questionId: string,
  studentId: string
): void {
  socket.instance.emit('saveSelectedStudentSubmission', {
    classroomUnitId,
    questionId,
    studentId
  });
}

export function removeSelectedStudentSubmission(
  classroomUnitId: string,
  questionId: string,
  studentId: string
): void {
  socket.instance.emit('removeSelectedStudentSubmission', {
    classroomUnitId,
    questionId,
    studentId,
  })
}

export function updateStudentSubmissionOrder(
  classroomUnitId: string,
  questionId: string,
  studentId: string
): void {
  socket.instance.emit('updateStudentSubmissionOrder', {
    classroomUnitId,
    questionId,
    studentId
  });
}

export function clearAllSelectedSubmissions(
  classroomUnitId: string,
  questionId: string
): void {
  socket.instance.emit('clearAllSelectedSubmissions', {
    classroomUnitId,
    questionId,
  });
}

export function setMode(
  classroomUnitId: string,
  questionId: string,
  mode
): void {
  socket.instance.emit('setMode', { classroomUnitId, questionId, mode });
}

export function removeMode(
  classroomUnitId: string,
  questionId: string
): void {
  socket.instance.emit('removeMode', { classroomUnitId, questionId });
}

export function setWatchTeacherState(classroomUnitId: string | null): void {
  socket.instance.emit('setWatchTeacherState', { classroomUnitId });
}

export function removeWatchTeacherState(classroomUnitId: string): void {
  socket.instance.emit('removeWatchTeacherState', { classroomUnitId });
}

export function registerTeacherPresence(classroomUnitId: string | null): void {
  socket.instance.emit('teacherConnected', { classroomUnitId });
}

export function showSignupModal() {
  return function (dispatch) {
    dispatch({type: C.SHOW_SIGNUP_MODAL})
  };
}

export function hideSignupModal() {
  return function (dispatch) {
    dispatch({type: C.HIDE_SIGNUP_MODAL})
  };
}

export function unpinActivityOnSaveAndExit(
  activityId: string,
  classroomUnitId: string
) {
    let url = new URL('/api/v1/classroom_units/unpin_and_lock_activity', process.env.EMPIRICAL_BASE_URL);
    const params = new URLSearchParams(JSON.stringify({
      activity_id: activityId,
      classroom_unit_id: classroomUnitId
    }));
    url.search = params.toString();

    fetch(url.href, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {},
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      console.log(response)
    }).catch((error) => {
      console.log(error)
    });
}

export function toggleStudentFlag(
  classroomUnitId: string|null,
  studentId: string
): void {
  socket.instance.emit('toggleStudentFlag', { classroomUnitId, studentId });
}

export function getClassroomAndTeacherNameFromServer(
  classroomUnitId: string|null,
  baseUrl: string|undefined
) {
  return function (dispatch) {
    let url = new URL('/api/v1/classroom_units/teacher_and_classroom_name', process.env.EMPIRICAL_BASE_URL);
    const params = new URLSearchParams(JSON.stringify({
      classroom_unit_id: classroomUnitId
    }));
    url.search = params.toString();

    fetch(url.href, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {},
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      _setClassroomAndTeacherName(response, classroomUnitId)
    }).catch((error) => {
      console.log('error retrieving classroom and teacher name', error)
    });
  }
}

function _setClassroomName(classroomName: string, classroomUnitId: string|null) {
  socket.instance.emit('setClassroomName', {
    classroomUnitId,
    classroomName,
  });
}

function _setTeacherName(teacherName: string, classroomUnitId: string|null) {
  socket.instance.emit('setTeacherName', { classroomUnitId, teacherName });
}

function _setClassroomAndTeacherName(
  names: TeacherAndClassroomName,
  classroomUnitId: string|null
): void {
  _setClassroomName(names.classroom, classroomUnitId)
  _setTeacherName(names.teacher, classroomUnitId)
}

export function addStudents(classroomUnitId: string, studentObj): void {
  let studentIds = studentObj.student_ids;
  let activitySessions = studentObj.activity_sessions_and_names;

  socket.instance.emit('addStudents', {
    classroomUnitId,
    activitySessions,
    studentIds,
  });
}

export function addFollowUpName(
  classroomUnitId: string,
  followUpActivityName: string|null
): void {
  socket.instance.emit('addFollowUpName', {
    classroomUnitId,
    followUpActivityName,
  });
}

export function addSupportingInfo(
  classroomUnitId: string,
  supportingInfo: string|null
): void {
  socket.instance.emit('addSupportingInfo', {
    classroomUnitId,
    supportingInfo,
  });
}

export function setSlideStartTime(
  classroomUnitId: string,
  questionId: string
): void {
  socket.instance.emit('setSlideStartTime', {
    classroomUnitId,
    questionId,
  });
}

export function setEditionId(
  classroomUnitId: string,
  editionId: string|null,
  callback?: Function
): void {
  socket.instance.emit('setEditionId', { classroomUnitId, editionId });
  socket.instance.on(`editionIdSet:${classroomUnitId}`, () => {
    socket.instance.removeAllListeners(`editionIdSet:${classroomUnitId}`);
    if (callback) {
      callback();
    }
  })
}

export function setTeacherModels(
  classroomUnitId: string|null,
  editionId: string
) {
  if (classroomUnitId) {
    socket.instance.emit('setTeacherModels', {
      classroomUnitId,
      editionId,
    });
  }
}

export function updateNoStudentError(student: string | null) {
  return function (dispatch) {
    dispatch({type: C.NO_STUDENT_ID, data: student})
  };
}

export function setModel(
  classroomUnitId: string,
  questionId: string,
  model
): void {
  socket.instance.emit('setModel', { classroomUnitId, questionId, model });
}

export function setPrompt(classroomUnitId: string, questionId: string, prompt): void {
  socket.instance.emit('setPrompt', {
    classroomUnitId,
    questionId,
    prompt,
  });
}

export function easyJoinLessonAddName(
  classroomUnitId: string,
  studentName: string
): void {
  socket.instance.emit('addStudent', { classroomUnitId, studentName });
  socket.instance.on(`studentAdded:${classroomUnitId}`, (addedStudentName, nameRef) => {
    socket.instance.removeAllListeners(`studentAdded:${classroomUnitId}`)
    if (addedStudentName === studentName) {
      window.location.replace(window.location.href + `&student=${nameRef}`);
      window.location.reload();
    }
  });
}

export function loadStudentNames(
  activityId: string,
  classroomUnitId: string,
  baseUrl: string|undefined
) {
  return function (dispatch) {
    let url = new URL('/api/v1/classroom_units/student_names', baseUrl);
    const params = new URLSearchParams(JSON.stringify({
      activity_id: activityId,
      classroom_unit_id: classroomUnitId
    }));
    url.search = params.toString();

    fetch(url.href, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {},
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      addStudents(classroomUnitId, response)
    }).catch((error) => {
      console.log('error retrieving students names ', error)
    });
  };
}

export function loadFollowUpNameAndSupportingInfo(
  activityId: string,
  baseUrl: string|undefined,
  classroomUnitId: string
) {
  return function (dispatch) {
    const coreUrl = baseUrl ? baseUrl : process.env.EMPIRICAL_BASE_URL
    fetch(`${coreUrl}/api/v1/activities/${activityId}/follow_up_activity_name_and_supporting_info`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {},
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      addFollowUpName(classroomUnitId, response.follow_up_activity_name)
      addSupportingInfo(classroomUnitId, response.supporting_info)
    }).catch((error) => {
      console.log('error retrieving follow up ', error)
    });
  };
}

export function loadSupportingInfo(
  activityId: string,
  baseUrl: string,
  classroomUnitId: string
) {
  return function (dispatch) {
    fetch(`${baseUrl}/api/v1/activities/${activityId}/supporting_info`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {},
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      addSupportingInfo(classroomUnitId, response.supporting_info)
    }).catch((error) => {
      console.log('error retrieving supporting info ', error)
    });
  };
}

export function createPreviewSession(editionId?:string) {
  const previewIdPrefix = 'prvw-';
  const classroomUnitId = `${previewIdPrefix}${uuid()}`;
  let previewSessionData;

  if (editionId) {
    previewSessionData = {
      'students': { 'student': 'James Joyce' },
      'current_slide': '0',
      'public': true,
      'preview': true,
      'edition_id': editionId,
      'id': classroomUnitId,
    };
  } else {
    previewSessionData = {
      'students': { 'student': 'James Joyce' },
      'current_slide': '0',
      'public': true,
      'preview': true,
      'id': classroomUnitId,
    };
  }

  socket.instance.emit('createPreviewSession', { previewSessionData });

  return classroomUnitId;
}

export function saveReview(activityId:string, classroomUnitId:string, value:number) {
  const review = {
    id: classroomUnitId,
    activity_id: activityId,
    value: value,
    classroom_unit_id: classroomUnitId,
  }
  socket.instance.emit('createOrUpdateReview', { review });
}
