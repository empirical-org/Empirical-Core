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
import { URL, URLSearchParams } from 'url';


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
  let url = new URL(`${process.env.EMPIRICAL_BASE_URL}/api/v1/classroom_activities/classroom_teacher_and_coteacher_ids`);
  let params = { classroom_unit_id: classroomUnitId }
  url.search = new URLSearchParams(params)

  fetch(url, {
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

export function toggleOnlyShowHeaders() {
  return function (dispatch) {
    dispatch({type: C.TOGGLE_HEADERS})
  }
}

export function startListeningToSessionForTeacher(
  classroomActivityId: string,
  activityId: string,
  classroomUnitId: string,
) {
  return function (dispatch, getState) {
    let initialized = false;

    socket.instance.on(`classroomLessonSession:${classroomActivityId}`, (session) => {
      if (session) {

        if (!_.isEqual(getState().classroomSessions.data, session)) {
          dispatch(updateSession(session));
        }
        dispatch(getInitialData(
          classroomActivityId,
          activityId,
          initialized,
          session.preview,
          classroomUnitId
        ))
        initialized = true
      } else {
        dispatch({type: C.NO_CLASSROOM_ACTIVITY, data: classroomActivityId})
      }
    });
    socket.instance.emit('subscribeToClassroomLessonSession', { classroomActivityId });
  }
}

export function getInitialData(
  ca_id: string,
  activityId: string,
  initialized,
  preview,
  classroomUnitId: string,
) {
  return function(dispatch) {
    if (!initialized && ca_id) {
      if (preview) {
        dispatch(getPreviewData(ca_id, activityId))
      } else {
        dispatch(getLessonData(ca_id, activityId, classroomUnitId))
      }
    }
  }
}

export function getLessonData(
  ca_id: string,
  activityId: string
  classroomUnitId: string,
) {
  return function(dispatch) {
    dispatch(getClassroomAndTeacherNameFromServer(classroomUnitId, process.env.EMPIRICAL_BASE_URL))
    dispatch(loadStudentNames(activityId, classroomUnitId, process.env.EMPIRICAL_BASE_URL))
    dispatch(loadFollowUpNameAndSupportingInfo(activityId, ca_id, process.env.EMPIRICAL_BASE_URL))
  }
}

export function getPreviewData(ca_id: string, lesson_id: string) {
  const baseUrl:string = process.env.EMPIRICAL_BASE_URL ? String(process.env.EMPIRICAL_BASE_URL) : 'https://quill.org/'
  return function(dispatch) {
    dispatch(loadSupportingInfo(lesson_id, ca_id, baseUrl))
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

export function registerPresence(classroomActivityId: string, studentId: string): void {
  socket.instance.emit('registerPresence', { classroomActivityId, studentId });
}

export function goToNextSlide(classroom_activity_id: string|null, state: ClassroomLessonSession, lesson: ClassroomLesson|CustomizeIntf.EditionQuestions) {
  if (classroom_activity_id) {
    const { current_slide } = state;
    const { questions } = lesson;
    const slides = questions ? Object.keys(questions) : [];
    const current_slide_index = slides.indexOf(current_slide.toString());
    const nextSlide = slides[current_slide_index + 1];
    if (nextSlide !== undefined) {
      return updateCurrentSlide(classroom_activity_id, nextSlide);
    }
  }
}

export function goToPreviousSlide(classroom_activity_id: string|null, state: ClassroomLessonSession, lesson: ClassroomLesson|CustomizeIntf.EditionQuestions) {
  if (classroom_activity_id) {
    const { current_slide } = state;
    const { questions } = lesson;
    const slides = questions ? Object.keys(questions) : [];
    const current_slide_index = slides.indexOf(current_slide.toString());
    const previousSlide = slides[current_slide_index - 1];
    if (previousSlide !== undefined) {
      return updateCurrentSlide(classroom_activity_id, previousSlide);
    }
  }
}

export function updateCurrentSlide(classroom_activity_id: string, question_id: string) {
  return (dispatch) => {
    dispatch(updateSlideInStore(question_id))
    updateSlide(classroom_activity_id, question_id)
  }
}

export function updateSlide(
  classroomActivityId: string,
  questionId: string
 ) {
  socket.instance.emit('updateClassroomLessonSession', {
    classroomActivityId,
    session: {
      id: classroomActivityId,
      current_slide: questionId,
    }
  });
  setSlideStartTime(classroomActivityId, questionId)
}

export function updateSlideInStore(slideId: string) {
  return{
    type: C.UPDATE_SLIDE_IN_STORE,
    data: slideId
  }
}

export function saveStudentSubmission(classroomActivityId: string, questionId: string, studentId: string, submission: {data: any}): void {
  socket.instance.emit('saveStudentSubmission', {
    classroomActivityId,
    questionId,
    studentId,
    submission,
  });
}

export function removeStudentSubmission(classroomActivityId: string, questionId: string, studentId: string): void {
  socket.instance.emit('removeStudentSubmission', {
    classroomActivityId,
    questionId,
    studentId,
  })
}

export function clearAllSubmissions(classroomActivityId: string, questionId: string): void {
  socket.instance.emit('clearAllSubmissions', {
    classroomActivityId,
    questionId,
  });
}

export function saveSelectedStudentSubmission(classroomActivityId: string, questionId: string, studentId: string): void {
  socket.instance.emit('saveSelectedStudentSubmission', {
    classroomActivityId,
    questionId,
    studentId
  });
}

export function removeSelectedStudentSubmission(classroomActivityId: string, questionId: string, studentId: string): void {
  socket.instance.emit('removeSelectedStudentSubmission', {
    classroomActivityId,
    questionId,
    studentId,
  })
}

export function updateStudentSubmissionOrder(classroomActivityId: string, questionId: string, studentId: string): void {
  socket.instance.emit('updateStudentSubmissionOrder', {
    classroomActivityId,
    questionId,
    studentId
  });
}

export function clearAllSelectedSubmissions(classroomActivityId: string, questionId: string): void {
  socket.instance.emit('clearAllSelectedSubmissions', {
    classroomActivityId,
    questionId,
  });
}

export function setMode(classroomActivityId: string, questionId: string, mode): void {
  socket.instance.emit('setMode', { classroomActivityId, questionId, mode });
}

export function removeMode(classroomActivityId: string, questionId: string): void {
  socket.instance.emit('removeMode', { classroomActivityId, questionId });
}

export function setWatchTeacherState(classroomActivityId: string | null): void {
  socket.instance.emit('setWatchTeacherState', { classroomActivityId });
}

export function removeWatchTeacherState(classroomActivityId: string): void {
  socket.instance.emit('removeWatchTeacherState', { classroomActivityId });
}

export function registerTeacherPresence(classroomActivityId: string | null): void {
  socket.instance.emit('teacherConnected', { classroomActivityId });
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
    let url = new URL(`${process.env.EMPIRICAL_BASE_URL}/api/v1/classroom_activities/unpin_and_lock_activity`);
    let params = {
      activity_id: activityId,
      classroom_unit_id: classroomUnitId
    }
    url.search = new URLSearchParams(params)

    fetch(url, {
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

export function toggleStudentFlag(classroomActivityId: string|null, studentId: string): void {
  socket.instance.emit('toggleStudentFlag', { classroomActivityId, studentId });
}

export function getClassroomAndTeacherNameFromServer(
  classroomUnitId: string|null,
  baseUrl: string|undefined
) {
  return function (dispatch) {
    let url = new URL(`${baseUrl}/api/v1/classroom_activities/teacher_and_classroom_name`);
    let params = { classroom_unit_id: classroomUnitId };
    url.search = new URLSearchParams(params)

    fetch(url, {
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

export function addFollowUpName(classroomActivityId: string, followUpActivityName: string|null): void {
  socket.instance.emit('addFollowUpName', {
    classroomActivityId,
    followUpActivityName,
  });
}

export function addSupportingInfo(classroomActivityId: string, supportingInfo: string|null): void {
  socket.instance.emit('addSupportingInfo', {
    classroomActivityId,
    supportingInfo,
  });
}

export function setSlideStartTime(classroomActivityId: string, questionId: string): void {
  socket.instance.emit('setSlideStartTime', {
    classroomActivityId,
    questionId,
  });
}

export function setEditionId(classroomActivityId: string, editionId: string|null, callback?: Function): void {
  socket.instance.emit('setEditionId', { classroomActivityId, editionId });
  socket.instance.on(`editionIdSet:${classroomActivityId}`, () => {
    socket.instance.removeAllListeners(`editionIdSet:${classroomActivityId}`);
    if (callback) {
      callback();
    }
  })
}

export function setTeacherModels(classroomActivityId: string|null, editionId: string) {
  if (classroomActivityId) {
    socket.instance.emit('setTeacherModels', {
      classroomActivityId,
      editionId,
    });
  }
}

export function updateNoStudentError(student: string | null) {
  return function (dispatch) {
    dispatch({type: C.NO_STUDENT_ID, data: student})
  };
}

export function setModel(classroomActivityId: string, questionId: string, model): void {
  socket.instance.emit('setModel', { classroomActivityId, questionId, model });
}

export function setPrompt(classroomActivityId: string, questionId: string, prompt): void {
  socket.instance.emit('setPrompt', {
    classroomActivityId,
    questionId,
    prompt,
  });
}

export function easyJoinLessonAddName(classroomActivityId: string, studentName: string): void {
  socket.instance.emit('addStudent', { classroomActivityId, studentName });
  socket.instance.on(`studentAdded:${classroomActivityId}`, (addedStudentName, nameRef) => {
    socket.instance.removeAllListeners(`studentAdded:${classroomActivityId}`)
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
    let url = new URL(`${baseUrl}/api/v1/classroom_activities/student_names`);
    let params = {
      activity_id: activityId,
      classroom_unit_id: classroomUnitId
    }
    url.search = new URLSearchParams(params)

    fetch(url, {
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

export function loadFollowUpNameAndSupportingInfo(lesson_id: string, classroom_activity_id: string, baseUrl: string|undefined) {
  return function (dispatch) {
    const coreUrl = baseUrl ? baseUrl : process.env.EMPIRICAL_BASE_URL
    fetch(`${baseUrl}/api/v1/activities/${lesson_id}/follow_up_activity_name_and_supporting_info`, {
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
      addFollowUpName(classroom_activity_id, response.follow_up_activity_name)
      addSupportingInfo(classroom_activity_id, response.supporting_info)
    }).catch((error) => {
      console.log('error retrieving follow up ', error)
    });
  };
}

export function loadSupportingInfo(lesson_id: string, classroom_activity_id: string, baseUrl: string) {
  return function (dispatch) {
    fetch(`${baseUrl}/api/v1/activities/${lesson_id}/supporting_info`, {
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
      addSupportingInfo(classroom_activity_id, response.supporting_info)
    }).catch((error) => {
      console.log('error retrieving supporting info ', error)
    });
  };
}

export function createPreviewSession(edition_id?:string) {
  const previewIdPrefix = 'prvw-';
  const classroomActivityId = `${previewIdPrefix}${uuid()}`;
  let previewSessionData;

  if (edition_id) {
    previewSessionData = {
      'students': { 'student': 'James Joyce' },
      'current_slide': '0',
      'public': true,
      'preview': true,
      'edition_id': edition_id,
      'id': classroomActivityId,
    };
  } else {
    previewSessionData = {
      'students': { 'student': 'James Joyce' },
      'current_slide': '0',
      'public': true,
      'preview': true,
      'id': classroomActivityId,
    };
  }

  socket.instance.emit('createPreviewSession', { previewSessionData });

  return classroomActivityId;
}

export function saveReview(activity_id:string, classroom_activity_id:string, value:number) {
  const review = {
    id: classroom_activity_id,
    activity_id: activity_id,
    value: value,
    classroom_activity_id: classroom_activity_id,
  }
  socket.instance.emit('createOrUpdateReview', { review });
}
