declare function require(name:string);
import C from '../constants';
import * as request from 'request'
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
import * as CustomizeIntf from '../interfaces/customize'
import uuid from 'uuid/v4';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8000');

export function startListeningToSession(classroom_activity_id: string) {
  return function(dispatch) {
    socket.on(`classroomLessonSession:${classroom_activity_id}`, (data) => {
      if (data) {
        dispatch(updateSession(data));
      } else {
        dispatch({type: C.NO_CLASSROOM_ACTIVITY, data: classroom_activity_id})
      }
    });
    socket.emit('subscribeToClassroomLessonSession', classroom_activity_id);
  };
}

export function startLesson(classroomActivityId: string, callback?: Function) {
  fetch(`${process.env.EMPIRICAL_BASE_URL}/api/v1/classroom_activities/${classroomActivityId}/classroom_teacher_and_coteacher_ids`, {
    method: "GET",
    mode: "cors",
    credentials: 'include',
  }).then(response => {
    if (!response.ok) {
      console.log(response.statusText)
    } else {
      return response.json()
    }
  }).then(response => {
    socket.emit('createOrUpdateClassroomLessonSession', classroomActivityId, response);
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

export function startListeningToSessionWithoutCurrentSlide(
  classroom_activity_id: string,
  lesson_id: string
) {
  return function (dispatch) {
    let initialized = false;

    socket.on(`classroomLessonSession:${classroom_activity_id}`, (session) => {
      if (session) {
        delete session.current_slide
        dispatch(updateClassroomSessionWithoutCurrentSlide(session));
        dispatch(getInitialData(
          classroom_activity_id,
          lesson_id,
          initialized,
          session.preview
        ))
        initialized = true
      } else {
        dispatch({type: C.NO_CLASSROOM_ACTIVITY, data: classroom_activity_id})
      }
    });
    socket.emit('subscribeToClassroomLessonSession', classroom_activity_id);
  }
}

export function updateClassroomSessionWithoutCurrentSlide(data) {
  return {
    type: C.UPDATE_CLASSROOM_SESSION_WITHOUT_CURRENT_SLIDE,
    data
  }
}

export function getInitialData(ca_id: string, lesson_id: string, initialized, preview) {
  return function(dispatch) {
    if (!initialized && ca_id) {
      if (preview) {
        dispatch(getPreviewData(ca_id, lesson_id))
      } else {
        dispatch(getLessonData(ca_id, lesson_id))
      }
    }
  }
}

export function getLessonData(ca_id: string, lesson_id: string) {
  return function(dispatch) {
    dispatch(getClassroomAndTeacherNameFromServer(ca_id, process.env.EMPIRICAL_BASE_URL))
    dispatch(loadStudentNames(ca_id, process.env.EMPIRICAL_BASE_URL))
    dispatch(loadFollowUpNameAndSupportingInfo(lesson_id, ca_id, process.env.EMPIRICAL_BASE_URL))
  }
}

export function getPreviewData(ca_id: string, lesson_id: string) {
  const baseUrl:string = process.env.EMPIRICAL_BASE_URL ? String(process.env.EMPIRICAL_BASE_URL) : 'https://quill.org/'
  return function(dispatch) {
    dispatch(loadSupportingInfo(lesson_id, ca_id, baseUrl))
  }
}

export function startListeningToCurrentSlide(classroomActivityId: string) {
  return function (dispatch) {
    socket.on(`currentSlide:${classroomActivityId}`, (slide) => {
      if (slide) {
        console.log('listening to current slide ', slide);
        dispatch(updateSlideInStore(slide));
      }
    });
    socket.emit('subscribeToCurrentSlide', classroomActivityId);
  }
}

export function updateSession(data: object): {type: string; data: any;} {
  return {
    type: C.UPDATE_CLASSROOM_SESSION_DATA,
    data,
  };
}

export function redirectAssignedStudents(classroomActivityId: string, followUpOption: string, followUpUrl: string) {
  socket.emit('redirectAssignedStudents',
    classroomActivityId,
    followUpOption,
    followUpUrl,
  )
}

export function registerPresence(classroomActivityId: string, studentId: string): void {
  socket.emit('registerPresence', classroomActivityId, studentId)
}

export function goToNextSlide(classroom_activity_id: string, state: ClassroomLessonSession, lesson: ClassroomLesson|CustomizeIntf.EditionQuestions) {
  const { current_slide } = state;
  const { questions } = lesson;
  const slides = Object.keys(questions);
  const current_slide_index = slides.indexOf(current_slide.toString());
  const nextSlide = slides[current_slide_index + 1];
  if (nextSlide !== undefined) {
    return updateCurrentSlide(classroom_activity_id, nextSlide);
  }
}

export function goToPreviousSlide(classroom_activity_id: string, state: ClassroomLessonSession, lesson: ClassroomLesson|CustomizeIntf.EditionQuestions) {
  const { current_slide } = state;
  const { questions } = lesson;
  const slides = Object.keys(questions);
  const current_slide_index = slides.indexOf(current_slide.toString());
  const previousSlide = slides[current_slide_index - 1];
  if (previousSlide !== undefined) {
    return updateCurrentSlide(classroom_activity_id, previousSlide);
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
  socket.emit('updateClassroomLessonSession', {
    id: classroomActivityId,
    current_slide: questionId,
  });
  setSlideStartTime(classroomActivityId, questionId)
}

export function updateSlideInStore(slideId: string) {
  return{
    type: C.UPDATE_SLIDE_IN_STORE,
    data: slideId
  }
}

export function saveStudentSubmission(classroomActivityId: string, questionId: string, studentId: string, submission: {data: any, timestamp: string}): void {
  socket.emit('saveStudentSubmission',
    classroomActivityId,
    questionId,
    studentId,
    submission,
  );

}

export function removeStudentSubmission(classroomActivityId: string, questionId: string, studentId: string): void {

  socket.emit('removeStudentSubmission',
    classroomActivityId,
    questionId,
    studentId
  )
}

export function clearAllSubmissions(classroomActivityId: string, question_id: string): void {
  socket.emit('clearAllSubmissions', classroomActivityId, question_id)
}

export function saveSelectedStudentSubmission(classroomActivityId: string, questionId: string, studentId: string): void {
  socket.emit('saveSelectedStudentSubmission', classroomActivityId, questionId, studentId)
}

export function removeSelectedStudentSubmission(classroomActivityId: string, questionId: string, studentId: string): void {
  socket.emit('removeSelectedStudentSubmission', classroomActivityId, questionId, studentId)
}

export function updateStudentSubmissionOrder(classroomActivityId: string, questionId: string, studentId: string): void {
  socket.emit('updateStudentSubmissionOrder', classroomActivityId, questionId, studentId)
}

export function clearAllSelectedSubmissions(classroomActivityId: string, questionId: string): void {
  socket.emit('clearAllSelectedSubmissions', classroomActivityId, questionId)
}

export function setMode(classroomActivityId: string, questionId: string, mode): void {
  socket.emit('setMode', classroomActivityId, questionId, mode)
}

export function removeMode(classroomActivityId: string, questionId: string): void {
  socket.emit('removeMode', classroomActivityId, questionId)
}

export function setWatchTeacherState(classroomActivityId: string | null): void {
  socket.emit('setWatchTeacherState', classroomActivityId)
}

export function removeWatchTeacherState(classroomActivityId: string): void {
  socket.emit('removeWatchTeacherState', classroomActivityId)
}

export function registerTeacherPresence(classroomActivityId: string | null): void {
  socket.emit('teacherConnected', classroomActivityId)
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

export function unpinActivityOnSaveAndExit(classroom_activity_id) {
    fetch(`${process.env.EMPIRICAL_BASE_URL}/api/v1/classroom_activities/${classroom_activity_id}/unpin_and_lock_activity`, {
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
  socket.emit('toggleStudentFlag', classroomActivityId, studentId)
}

export function getClassroomAndTeacherNameFromServer(classroom_activity_id: string|null, baseUrl: string|undefined) {
  return function (dispatch) {
    fetch(`${baseUrl}/api/v1/classroom_activities/${classroom_activity_id}/teacher_and_classroom_name`, {
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
      _setClassroomAndTeacherName(response, classroom_activity_id)
    }).catch((error) => {
      console.log('error retrieving classroom and teacher name', error)
    });
  }
}

function _setClassroomName(classroomName: string, classroomActivityId: string|null) {
  socket.emit('setClassroomName', classroomActivityId, classroomName)
}

function _setTeacherName(teacherName: string, classroomActivityId: string|null) {
  socket.emit('setTeacherName', classroomActivityId, teacherName)
}

function _setClassroomAndTeacherName(names: TeacherAndClassroomName, classroom_activity_id: string|null): void {
  _setClassroomName(names.classroom, classroom_activity_id)
  _setTeacherName(names.teacher, classroom_activity_id)
}

export function addStudents(classroomActivityId: string, studentObj): void {
  let studentIds = studentObj.student_ids;
  let activitySessions = studentObj.activity_sessions_and_names;

  socket.emit('addStudents',
    classroomActivityId,
    activitySessions,
    studentIds,
  )
}

export function addFollowUpName(classroomActivityId: string, followUpActivityName: string|null): void {
  socket.emit('addFollowUpName', classroomActivityId, followUpActivityName)
}

export function addSupportingInfo(classroomActivityId: string, supportingInfo: string|null): void {
  socket.emit('addSupportingInfo', classroomActivityId, supportingInfo)
}

export function setSlideStartTime(classroomActivityId: string, questionId: string): void {

  socket.emit('setSlideStartTime', classroomActivityId, questionId);
}

export function setEditionId(classroomActivityId: string, editionId: string|null, callback?: Function): void {
  socket.emit('setEditionId', classroomActivityId, editionId)
  socket.on(`editionIdSet:${classroomActivityId}`, () => {
    if (callback) {
      callback();
    }
  })
}

export function setTeacherModels(classroomActivityId: string, editionId: string) {
  socket.emit('setTeacherModels', classroomActivityId, editionId)
}

export function updateNoStudentError(student: string | null) {
  return function (dispatch) {
    dispatch({type: C.NO_STUDENT_ID, data: student})
  };
}

export function setModel(classroomActivityId: string, questionId: string, model): void {
  socket.emit('setModel', classroomActivityId, questionId, model)
}

export function setPrompt(classroomActivityId: string, questionId: string, prompt): void {
  socket.emit('setPrompt', classroomActivityId, questionId, prompt)
}

export function easyJoinLessonAddName(classroomActivityId: string, studentName: string): void {
  socket.emit('addStudent', classroomActivityId, studentName)
  socket.on(`studentAdded:${classroomActivityId}`, (addedStudentName, nameRef) => {
    if (addedStudentName === studentName) {
      window.location.replace(window.location.href + `&student=${nameRef}`);
      window.location.reload();
    }
  });
}

export function loadStudentNames(classroom_activity_id: string, baseUrl: string|undefined) {
  return function (dispatch) {
    fetch(`${baseUrl}/api/v1/classroom_activities/${classroom_activity_id}/student_names`, {
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
      addStudents(classroom_activity_id, response)
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
  const classroomActivityId = uuid();
  let previewSession;

  if (edition_id) {
    previewSession = {
      'students': { 'student': 'James Joyce' },
      'current_slide': '0',
      'public': true,
      'preview': true,
      'edition_id': edition_id,
      'id': classroomActivityId,
    }
  } else {
    previewSession = {
      'students': { 'student': 'James Joyce' },
      'current_slide': '0',
      'public': true,
      'preview': true,
      'id': classroomActivityId,
    }
  }

  socket.emit('createPreviewSession', previewSession)

  return classroomActivityId;
}

export function saveReview(activity_id:string, classroom_activity_id:string, value:number) {
  const review = {
    id: classroom_activity_id,
    activity_id: activity_id,
    value: value,
    classroom_activity_id: classroom_activity_id,
  }
  socket.emit('createOrUpdateReview', review)
}
