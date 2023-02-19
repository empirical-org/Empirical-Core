declare function require(name:string);
import _ from 'lodash';
import {v4 as uuid} from 'uuid';

import C from '../constants';
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList,
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
  TeacherAndClassroomName,
  ClassroomSessionId,
  ClassroomUnitId
} from '../components/classroomLessons/interfaces';
import {
  ClassroomLesson
} from '../interfaces/classroomLessons';
import * as CustomizeIntf from '../interfaces/customize';
import socket from '../utils/socketStore';
import { requestGet, requestPut, } from '../../../modules/request/index'

export function startListeningToSession(classroomSessionId: ClassroomSessionId) {
  return function(dispatch, getState) {
    socket.instance.on(`classroomLessonSession:${classroomSessionId}`, (data) => {
      if (data) {
        if (!_.isEqual(getState().classroomSessions.data, data)) {
          dispatch(updateSession(data));
        }
      } else {
        dispatch({type: C.NO_CLASSROOM_UNIT, data: classroomSessionId})
      }
    });
    socket.instance.emit('subscribeToClassroomLessonSession', { classroomSessionId });
  };
}

export function startLesson(classroomUnitId: ClassroomUnitId, classroomSessionId: ClassroomSessionId, callback?: Function) {
  let url = new URL('/api/v1/classroom_units/classroom_teacher_and_coteacher_ids', import.meta.env.DEFAULT_URL);
  const params = {
    classroom_unit_id: classroomUnitId
  };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  fetch(url.href, {
    method: "GET",
    mode: "cors",
    credentials: 'include',
  }).then(response => {
    if (!response.ok) {
      // to do - do something with the status text
    } else {
      return response.json()
    }
  }).then(teacherIdObject => {
    socket.instance.emit('createOrUpdateClassroomLessonSession', {
      classroomSessionId,
      teacherIdObject
    });
  })

  if (callback) {
    callback();
  }
}

export const fetchActiveActivitySession = ({ sessionID, callback, }) => {
  const activeActivitySessionUrl = `${import.meta.env.DEFAULT_URL}/api/v1/active_activity_sessions/${sessionID}`

  requestGet(activeActivitySessionUrl,
    (body) => {
      if (callback) callback(body)
    },
    (body) => {
      if (callback) callback(body)
    }
  )
}

export const saveActiveActivitySession = ({ sessionID, timeTracking, callback, }) => {
  const activeActivitySessionUrl = `${import.meta.env.DEFAULT_URL}/api/v1/active_activity_sessions/${sessionID}`

  requestPut(
    activeActivitySessionUrl,
    {
      active_activity_session: {
        timeTracking,
      }
    },
    (body) => {
      if (callback) callback()
    },
    (body) => {
      if (callback) callback()
    }
  )
}

export function finishActivity(
  followUp,
  conceptResults,
  editionId,
  activityId,
  classroomUnitId: ClassroomUnitId,
  callback?: Function
) {
  const data = JSON.stringify({
    follow_up: followUp,
    concept_results: conceptResults,
    edition_id: editionId,
    activity_id: activityId,
    classroom_unit_id: classroomUnitId,
  });

  fetch(`${import.meta.env.DEFAULT_URL}/api/v1/classroom_units/finish_lesson`, {
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
    // to do - do something with this error
  })

}

export function toggleOnlyShowHeaders() {
  return function (dispatch) {
    dispatch({type: C.TOGGLE_HEADERS})
  }
}

export function startListeningToSessionForTeacher(
  activityId: string,
  classroomUnitId: ClassroomUnitId,
  classroomSessionId: ClassroomSessionId
) {
  return function (dispatch, getState) {
    let initialized = false;

    socket.instance.on(`classroomLessonSession:${classroomSessionId}`, (session) => {
      if (session) {

        if (!_.isEqual(getState().classroomSessions.data, session)) {
          dispatch(updateSession(session));
        }
        dispatch(getInitialData(
          activityId,
          initialized,
          session.preview,
          classroomSessionId,
          classroomUnitId
        ))
        initialized = true
      } else {
        dispatch({type: C.NO_CLASSROOM_UNIT, data: classroomSessionId})
      }
    });
    socket.instance.emit('subscribeToClassroomLessonSession', { classroomSessionId });
  }
}

export function getInitialData(
  activityId: string,
  initialized,
  preview,
  classroomSessionId: ClassroomSessionId,
  classroomUnitId: ClassroomUnitId
) {
  return function(dispatch) {
    if (!initialized && classroomSessionId) {
      if (preview) {
        dispatch(getPreviewData(activityId, classroomSessionId))
      } else {
        dispatch(getLessonData(activityId, classroomSessionId, classroomUnitId))
      }
    }
  }
}

export function getLessonData(
  activityId: string,
  classroomSessionId: ClassroomSessionId,
  classroomUnitId: ClassroomUnitId
) {
  return function(dispatch) {
    dispatch(getClassroomAndTeacherNameFromServer(classroomUnitId, classroomSessionId, import.meta.env.DEFAULT_URL))
    dispatch(loadStudentNames(activityId, classroomUnitId, classroomSessionId, import.meta.env.DEFAULT_URL))
    dispatch(loadFollowUpNameAndSupportingInfo(activityId, import.meta.env.DEFAULT_URL, classroomSessionId))
  }
}

export function getPreviewData(
  activityId: string,
  classroomSessionId: ClassroomSessionId
) {
  const baseUrl:string = import.meta.env.DEFAULT_URL ? String(import.meta.env.DEFAULT_URL) : 'https://quill.org/'
  return function(dispatch) {
    dispatch(loadSupportingInfo(activityId, baseUrl, classroomSessionId))
  }
}

export function updateSession(data: object): {type: string; data: any;} {
  return {
    type: C.UPDATE_CLASSROOM_SESSION_DATA,
    data,
  };
}

export function redirectAssignedStudents(
  classroomSessionId: ClassroomSessionId,
  followUpOption: string,
  followUpUrl: string
) {
  socket.instance.emit('redirectAssignedStudents', {
    classroomSessionId,
    followUpOption,
    followUpUrl,
  })
}

export function registerPresence(
  classroomSessionId: ClassroomSessionId,
  studentId: string
): void {
  socket.instance.emit('registerPresence', { classroomSessionId, studentId });
}

export function goToNextSlide(
  state: ClassroomLessonSession,
  lesson: ClassroomLesson|CustomizeIntf.EditionQuestions,
  classroomSessionId: ClassroomSessionId|null
) {
  if (classroomSessionId) {
    const { current_slide } = state;
    const { questions } = lesson;
    const slides = questions ? Object.keys(questions) : [];
    const current_slide_index = slides.indexOf(current_slide.toString());
    const nextSlide = slides[current_slide_index + 1];
    if (nextSlide !== undefined) {
      return updateCurrentSlide(nextSlide, classroomSessionId);
    }
  }
}

export function goToPreviousSlide(
  state: ClassroomLessonSession,
  lesson: ClassroomLesson|CustomizeIntf.EditionQuestions,
  classroomSessionId: ClassroomSessionId|null
) {
  if (classroomSessionId) {
    const { current_slide } = state;
    const { questions } = lesson;
    const slides = questions ? Object.keys(questions) : [];
    const current_slide_index = slides.indexOf(current_slide.toString());
    const previousSlide = slides[current_slide_index - 1];
    if (previousSlide !== undefined) {
      return updateCurrentSlide(previousSlide, classroomSessionId);
    }
  }
}

export function updateCurrentSlide(
  question_id: string,
  classroomSessionId: ClassroomSessionId
) {
  return (dispatch) => {
    dispatch(updateSlideInStore(question_id))
    updateSlide(question_id, classroomSessionId)
  }
}

export function updateSlide(
  questionId: string,
  classroomSessionId: ClassroomSessionId
) {
  socket.instance.emit('updateClassroomLessonSession', {
    classroomSessionId,
    session: {
      id: classroomSessionId,
      current_slide: questionId,
    }
  });
  setSlideStartTime(classroomSessionId, questionId)
}

export function updateSlideInStore(slideId: string) {
  return{
    type: C.UPDATE_SLIDE_IN_STORE,
    data: slideId
  }
}

export function saveStudentSubmission(
  classroomSessionId: ClassroomSessionId,
  questionId: string,
  studentId: string,
  submission: {data: any}
): void {
  socket.instance.emit('saveStudentSubmission', {
    classroomSessionId,
    questionId,
    studentId,
    submission,
  });
}

export function removeStudentSubmission(
  classroomSessionId: ClassroomSessionId,
  questionId: string,
  studentId: string
): void {
  socket.instance.emit('removeStudentSubmission', {
    classroomSessionId,
    questionId,
    studentId,
  })
}

export function clearAllSubmissions(
  classroomSessionId: ClassroomSessionId,
  questionId: string
): void {
  socket.instance.emit('clearAllSubmissions', {
    classroomSessionId,
    questionId,
  });
}

export function saveSelectedStudentSubmission(
  classroomSessionId: ClassroomSessionId,
  questionId: string,
  studentId: string
): void {
  socket.instance.emit('saveSelectedStudentSubmission', {
    classroomSessionId,
    questionId,
    studentId
  });
}

export function removeSelectedStudentSubmission(
  classroomSessionId: ClassroomSessionId,
  questionId: string,
  studentId: string
): void {
  socket.instance.emit('removeSelectedStudentSubmission', {
    classroomSessionId,
    questionId,
    studentId,
  })
}

export function updateStudentSubmissionOrder(
  classroomSessionId: ClassroomSessionId,
  questionId: string,
  studentId: string
): void {
  socket.instance.emit('updateStudentSubmissionOrder', {
    classroomSessionId,
    questionId,
    studentId
  });
}

export function clearAllSelectedSubmissions(
  classroomSessionId: ClassroomSessionId,
  questionId: string
): void {
  socket.instance.emit('clearAllSelectedSubmissions', {
    classroomSessionId,
    questionId,
  });
}

export function setMode(
  classroomSessionId: ClassroomSessionId,
  questionId: string,
  mode
): void {
  socket.instance.emit('setMode', { classroomSessionId, questionId, mode });
}

export function removeMode(
  classroomSessionId: ClassroomSessionId,
  questionId: string
): void {
  socket.instance.emit('removeMode', { classroomSessionId, questionId });
}

export function setWatchTeacherState(classroomSessionId: ClassroomSessionId | null): void {
  socket.instance.emit('setWatchTeacherState', { classroomSessionId });
}

export function removeWatchTeacherState(classroomSessionId: ClassroomSessionId): void {
  socket.instance.emit('removeWatchTeacherState', { classroomSessionId });
}

export function registerTeacherPresence(classroomSessionId: ClassroomSessionId | null): void {
  socket.instance.emit('teacherConnected', { classroomSessionId });
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
  classroomUnitId: ClassroomUnitId
) {
  let url = new URL('/api/v1/classroom_units/unpin_and_lock_activity', import.meta.env.DEFAULT_URL);
  const params = {
    activity_id: activityId,
    classroom_unit_id: classroomUnitId
  };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

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
    // to do - do something with this response
  }).catch((error) => {
    // to do - do something with this error
  });
}

export function toggleStudentFlag(
  classroomSessionId: ClassroomSessionId|null,
  studentId: string
): void {
  socket.instance.emit('toggleStudentFlag', { classroomSessionId, studentId });
}

export function getClassroomAndTeacherNameFromServer(
  classroomUnitId: ClassroomUnitId|null,
  classroomSessionId: ClassroomSessionId,
  baseUrl: string|undefined
) {
  return function (dispatch) {
    let url = new URL('/api/v1/classroom_units/teacher_and_classroom_name', import.meta.env.DEFAULT_URL);
    const params = {
      classroom_unit_id: classroomUnitId
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

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
      _setClassroomAndTeacherName(response, classroomSessionId)
    }).catch((error) => {
      // to do - do something with this error
    });
  }
}

function _setClassroomName(classroomName: string, classroomSessionId: ClassroomSessionId|null) {
  socket.instance.emit('setClassroomName', {
    classroomSessionId,
    classroomName,
  });
}

function _setTeacherName(teacherName: string, classroomSessionId: ClassroomSessionId|null) {
  socket.instance.emit('setTeacherName', { classroomSessionId, teacherName });
}

function _setClassroomAndTeacherName(
  names: TeacherAndClassroomName,
  classroomSessionId: ClassroomSessionId|null
): void {
  _setClassroomName(names.classroom, classroomSessionId)
  _setTeacherName(names.teacher, classroomSessionId)
}

export function addStudents(classroomSessionId: ClassroomSessionId, studentObj): void {
  let studentIds = studentObj.student_ids;
  let activitySessions = studentObj.activity_sessions_and_names;

  socket.instance.emit('addStudents', {
    classroomSessionId,
    activitySessions,
    studentIds,
  });
}

export function addFollowUpName(
  classroomSessionId: ClassroomSessionId,
  followUpActivityName: string|null
): void {
  socket.instance.emit('addFollowUpName', {
    classroomSessionId,
    followUpActivityName,
  });
}

export function addSupportingInfo(
  classroomSessionId: ClassroomSessionId,
  supportingInfo: string|null
): void {
  socket.instance.emit('addSupportingInfo', {
    classroomSessionId,
    supportingInfo,
  });
}

export function setSlideStartTime(
  classroomSessionId: ClassroomSessionId,
  questionId: string
): void {
  socket.instance.emit('setSlideStartTime', {
    classroomSessionId,
    questionId,
  });
}

export function setEditionId(
  classroomSessionId: ClassroomSessionId,
  editionId: string|null,
  callback?: Function
): void {
  socket.instance.emit('setEditionId', { classroomSessionId, editionId });
  socket.instance.on(`editionIdSet:${classroomSessionId}`, () => {
    socket.instance.removeAllListeners(`editionIdSet:${classroomSessionId}`);
    if (callback) {
      callback();
    }
  })
}

export function setTeacherModels(
  classroomSessionId: ClassroomSessionId|null,
  editionId: string
) {
  if (classroomSessionId) {
    socket.instance.emit('setTeacherModels', {
      classroomSessionId,
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
  classroomSessionId: ClassroomSessionId,
  questionId: string,
  model
): void {
  socket.instance.emit('setModel', { classroomSessionId, questionId, model });
}

export function setPrompt(classroomSessionId: ClassroomSessionId, questionId: string, prompt): void {
  socket.instance.emit('setPrompt', {
    classroomSessionId,
    questionId,
    prompt,
  });
}

export function easyJoinLessonAddName(
  classroomSessionId: ClassroomSessionId,
  studentName: string
): void {
  socket.instance.emit('addStudent', { classroomSessionId, studentName });
  socket.instance.on(`studentAdded:${classroomSessionId}`, (addedStudentName, nameRef) => {
    socket.instance.removeAllListeners(`studentAdded:${classroomSessionId}`)
    if (addedStudentName === studentName) {
      window.location.replace(window.location.href + `&student=${nameRef}`);
      window.location.reload();
    }
  });
}

export function loadStudentNames(
  activityId: string,
  classroomUnitId: ClassroomUnitId,
  classroomSessionId: ClassroomSessionId,
  baseUrl: string|undefined
) {
  return function (dispatch) {
    let url = new URL('/api/v1/classroom_units/student_names', baseUrl);
    const params = {
      activity_id: activityId,
      classroom_unit_id: classroomUnitId
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

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
      addStudents(classroomSessionId, response)
    }).catch((error) => {
      // to do - do something with this error
    });
  };
}

export function loadFollowUpNameAndSupportingInfo(
  activityId: string,
  baseUrl: string|undefined,
  classroomSessionId: ClassroomSessionId
) {
  return function (dispatch) {
    const coreUrl = baseUrl ? baseUrl : import.meta.env.DEFAULT_URL
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
      addFollowUpName(classroomSessionId, response.follow_up_activity_name)
      addSupportingInfo(classroomSessionId, response.supporting_info)
    }).catch((error) => {
      // to do - do something with this error
    });
  };
}

export function loadSupportingInfo(
  activityId: string,
  baseUrl: string,
  classroomSessionId: ClassroomSessionId
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
      addSupportingInfo(classroomSessionId, response.supporting_info)
    }).catch((error) => {
      // to do - do something with this error
    });
  };
}

export function createPreviewSession(lessonId: string, editionId?:string) {
  const previewIdPrefix = 'prvw-';
  const uuidString = uuid();
  const classroomSessionId = `${previewIdPrefix}${uuidString}${lessonId}`;
  let previewSessionData;

  if (editionId) {
    previewSessionData = {
      'students': { 'student': 'James Joyce' },
      'current_slide': '0',
      'public': true,
      'preview': true,
      'edition_id': editionId,
      'id': `${classroomSessionId}`,
    };
  } else {
    previewSessionData = {
      'students': { 'student': 'James Joyce' },
      'current_slide': '0',
      'public': true,
      'preview': true,
      'id': classroomSessionId,
    };
  }

  socket.instance.emit('createPreviewSession', { previewSessionData });

  return `${previewIdPrefix}${uuidString}`;
}

export function saveReview(activityId:string, classroomSessionId:ClassroomSessionId, value:number) {
  const review = {
    id: classroomSessionId,
    activity_id: activityId,
    value: value,
    classroom_session_id: classroomSessionId,
  }
  socket.instance.emit('createOrUpdateReview', { review });
}
