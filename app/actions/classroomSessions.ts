declare function require(name:string);
import C from '../constants';
import rootRef, { firebase } from '../libs/firebase';
import * as request from 'request'
const classroomSessionsRef = rootRef.child('classroom_lesson_sessions');
const classroomLessonsRef = rootRef.child('classroom_lessons');
const editionQuestionsRef = rootRef.child('lesson_edition_questions');
const reviewsRef = rootRef.child('reviews')
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
  socket.emit('createOrUpdateClassroomLessonSession', classroomActivityId);
  if (callback) {
    callback();
  }
}

export function toggleOnlyShowHeaders() {
  return function (dispatch)
    dispatch({type: C.TOGGLE_HEADERS})
  }
}

export function startListeningToSessionWithoutCurrentSlide(
  classroom_activity_id: string,
  lesson_id: string
) {
  return function (dispatch) {
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

export function startListeningToCurrentSlide(classroom_activity_id: string) {
  return function (dispatch) {
    socket.on(`currentSlide:${classroom_activity_id}`, (slide) => {
      if (slide) {
        console.log('listening to current slide ', slide);
        dispatch(updateSlideInStore(slide));
      }
    });
    socket.emit('subscribeToCurrentSlide', classroom_activity_id);
  }
}

export function updateSession(data: object): {type: string; data: any;} {
  return {
    type: C.UPDATE_CLASSROOM_SESSION_DATA,
    data,
  };
}

export function redirectAssignedStudents(classroom_activity_id: string, followUpOption: string, followUpUrl: string) {
  const followUpOptionRef = classroomSessionsRef.child(`${classroom_activity_id}/followUpOption`)
  const followUpUrlRef = classroomSessionsRef.child(`${classroom_activity_id}/followUpUrl`)
  followUpOptionRef.set(followUpOption)
  followUpUrlRef.set(followUpUrl)
}

export function registerPresence(classroom_activity_id: string, student_id: string): void {
  const presenceRef = classroomSessionsRef.child(`${classroom_activity_id}/presence/${student_id}`);
  firebase.database().ref('.info/connected').on('value', (snapshot) => {
    if (snapshot && snapshot.val() === true) {
      presenceRef.onDisconnect().set(false);
      presenceRef.set(true);
    }
  });
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
    updateSlideInFirebase(classroom_activity_id, question_id)
  }
}

export function updateSlideInFirebase(classroom_activity_id: string , question_id: string ) {
  const currentSlideRef = classroomSessionsRef.child(`${classroom_activity_id}/current_slide`);
  currentSlideRef.set(question_id);
  setSlideStartTime(classroom_activity_id, question_id)
}

export function updateSlideInStore(slideId: string) {
  return{
    type: C.UPDATE_SLIDE_IN_STORE,
    data: slideId
  }
}

export function saveStudentSubmission(classroom_activity_id: string, question_id: string, student_id: string, submission: {data: any, timestamp: string}): void {
  const submissionRef = classroomSessionsRef.child(`${classroom_activity_id}/submissions/${question_id}/${student_id}`);
  submissionRef.set(submission);
}

export function removeStudentSubmission(classroom_activity_id: string, question_id: string, student_id: string): void {
  const submissionRef = classroomSessionsRef.child(`${classroom_activity_id}/submissions/${question_id}/${student_id}`);
  submissionRef.remove();
}

export function clearAllSubmissions(classroom_activity_id: string, question_id: string): void {
  const submissionRef = classroomSessionsRef.child(`${classroom_activity_id}/submissions/${question_id}`);
  submissionRef.remove()
}

export function removeSelectedSubmissionOrder(classroom_activity_id: string, question_id: string): void {
  const submissionOrderRef = classroomSessionsRef.child(`${classroom_activity_id}/selected_submission_order/${question_id}`);
  submissionOrderRef.remove()
}

export function saveSelectedStudentSubmission(classroom_activity_id: string, question_id: string, student_id: string): void {
  const selectedSubmissionRef = classroomSessionsRef.child(`${classroom_activity_id}/selected_submissions/${question_id}/${student_id}`);
  selectedSubmissionRef.set(true);
}

export function removeSelectedStudentSubmission(classroom_activity_id: string, question_id: string, student_id: string): void {
  const selectedSubmissionRef = classroomSessionsRef.child(`${classroom_activity_id}/selected_submissions/${question_id}/${student_id}`);
  selectedSubmissionRef.remove();
}

export function updateStudentSubmissionOrder(classroom_activity_id: string, question_id: string, student_id: string): void {
  const selectedSubmissionOrderRef = classroomSessionsRef.child(`${classroom_activity_id}/selected_submission_order/${question_id}`);
  selectedSubmissionOrderRef.once('value', (snapshot) => {
    const currentArray = snapshot.val()
    if (currentArray) {
      if (currentArray.includes(student_id)) {
        const index = currentArray.indexOf(student_id)
        currentArray.splice(index, 1)
        selectedSubmissionOrderRef.set(currentArray)
      } else {
        currentArray.push(student_id)
        selectedSubmissionOrderRef.set(currentArray)
      }
    } else {
      selectedSubmissionOrderRef.set([student_id])
    }
  })
}

export function clearAllSelectedSubmissions(classroom_activity_id: string, question_id: string): void {
  const selectedSubmissionRef = classroomSessionsRef.child(`${classroom_activity_id}/selected_submissions/${question_id}`);
  selectedSubmissionRef.remove()
}

export function setMode(classroom_activity_id: string, question_id: string, mode): void {
  const modeRef = classroomSessionsRef.child(`${classroom_activity_id}/modes/${question_id}`);
  modeRef.set(mode);
}

export function removeMode(classroom_activity_id: string, question_id: string): void {
  const modeRef = classroomSessionsRef.child(`${classroom_activity_id}/modes/${question_id}`);
  modeRef.remove();
}

export function setWatchTeacherState(classroom_activity_id: string | null): void {
  const watchTeacherRef = classroomSessionsRef.child(`${classroom_activity_id}/watchTeacherState`);
  watchTeacherRef.set(true);
}

export function removeWatchTeacherState(classroom_activity_id: string): void {
  const watchTeacherRef = classroomSessionsRef.child(`${classroom_activity_id}/watchTeacherState`);
  watchTeacherRef.remove();
}

export function registerTeacherPresence(classroom_activity_id: string | null): void {
  const absentTeacherRef = classroomSessionsRef.child(`${classroom_activity_id}/absentTeacherState`);
  firebase.database().ref('.info/connected').on('value', (snapshot) => {
    if (snapshot && snapshot.val() === true) {
      absentTeacherRef.onDisconnect().set(true);
      absentTeacherRef.set(false);
    }
  });
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

export function toggleStudentFlag(classroomActivityId: string|null, student_id: string): void {
  const flaggedStudentRef = classroomSessionsRef.child(`${classroomActivityId}/flaggedStudents/${student_id}`)
  flaggedStudentRef.once('value', (snapshot) => {
    if(snapshot.val()){
      flaggedStudentRef.remove()
    } else {
      flaggedStudentRef.set(true)
    }
  })
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

function _setClassroomName(classroomName: string, classroom_activity_id: string|null) {
  const classroomNameRef = classroomSessionsRef.child(`${classroom_activity_id}/classroom_name`);
  classroomNameRef.set(classroomName)
}

function _setTeacherName(teacherName: string, classroom_activity_id: string|null) {
  const teacherNameRef = classroomSessionsRef.child(`${classroom_activity_id}/teacher_name`);
  teacherNameRef.set(teacherName)
}

function _setClassroomAndTeacherName(names: TeacherAndClassroomName, classroom_activity_id: string|null): void {
  _setClassroomName(names.classroom, classroom_activity_id)
  _setTeacherName(names.teacher, classroom_activity_id)
}

export function addStudents(classroom_activity_id: string, studentObj): void {
  const studentsRef = classroomSessionsRef.child(`${classroom_activity_id}/students`);
  studentsRef.set(studentObj.activity_sessions_and_names)
  const studentIdsRef = classroomSessionsRef.child(`${classroom_activity_id}/student_ids`);
  studentIdsRef.set(studentObj.student_ids)
}

export function addFollowUpName(classroom_activity_id: string, followUpActivityName: string|null): void {
  const followUpRef = classroomSessionsRef.child(`${classroom_activity_id}/followUpActivityName`);
  followUpRef.set(followUpActivityName)
}

export function addSupportingInfo(classroom_activity_id: string, supportingInfo: string|null): void {
  const supportingInfoRef = classroomSessionsRef.child(`${classroom_activity_id}/supportingInfo`);
  supportingInfoRef.set(supportingInfo)
}

export function setSlideStartTime(classroom_activity_id: string, question_id: string): void {
  const timestampRef = classroomSessionsRef.child(`${classroom_activity_id}/timestamps/${question_id}`);
  const submissionRef = classroomSessionsRef.child(`${classroom_activity_id}/submissions/${question_id}`)
  // update timestamp if the teacher clicks on a slide and there are no submissions yet
  submissionRef.on('value', (snapshot) => {
    if (snapshot && snapshot.val() === null) {
      timestampRef.set(firebase.database.ServerValue.TIMESTAMP)
    }
  });
}

export function setEditionId(classroom_activity_id: string, editionId: string|null, callback?: Function): void {
  const editionRef = classroomSessionsRef.child(`${classroom_activity_id}/edition_id`);
  if (editionId) {
    editionRef.once('value', (snapshot) => {
      if (snapshot.val() !== editionId) {
        setTeacherModels(classroom_activity_id, editionId)
      }
    })
    editionRef.set(editionId)
  } else {
    editionRef.remove()
  }
  if (callback) {
    callback()
  }
}

export function setTeacherModels(classroom_activity_id: string, editionId: string) {
  const editionQuestionsArrayRef = editionQuestionsRef.child(`${editionId}/questions`)
  const sessionPromptsRef = classroomSessionsRef.child(`${classroom_activity_id}/prompts`)
  const sessionModelsRef = classroomSessionsRef.child(`${classroom_activity_id}/models`)
  editionQuestionsArrayRef.once('value', (questionsSnap) => {
    sessionPromptsRef.once('value', (promptsSnap) => {
      const questions = questionsSnap.val()
      const prompts = promptsSnap.val()
      if (questions && prompts) {
        Object.keys(prompts).forEach(key => {
          if (questions[key] && questions[key].data && questions[key].data.play && questions[key].data.play.prompt) {
            if (prompts[key] !== questions[key].data.play.prompt) {
              sessionPromptsRef.child(key).set(questions[key].data.play.prompt)
              sessionModelsRef.child(key).remove()
            }
          }
        })
      }
    })
  })
}

export function updateNoStudentError(student: string | null) {
  return function (dispatch) {
    dispatch({type: C.NO_STUDENT_ID, data: student})
  };
}

export function setModel(classroom_activity_id: string, question_id: string, model): void {
  const modelRef = classroomSessionsRef.child(`${classroom_activity_id}/models/${question_id}`);
  modelRef.set(model);
}

export function setPrompt(classroom_activity_id: string, question_id: string, prompt): void {
  const promptRef = classroomSessionsRef.child(`${classroom_activity_id}/prompts/${question_id}`);
  promptRef.set(prompt);
}

export function easyJoinLessonAddName(classroom_activity_id: string, studentName: string): void {
  const nameRef: string = studentName.replace(/\s/g, '').toLowerCase()
  const newStudentsRef = classroomSessionsRef.child(`${classroom_activity_id}/students/${nameRef}`);
  newStudentsRef.set(studentName, (error) => {
    if (error) {
      console.log("Data could not be saved." + error);
    } else {
      window.location.replace(window.location.href + `&student=${nameRef}`)
      window.location.reload()
    }
  })
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

// export function createPreviewSession(edition_id?:string) {
//   let previewSession
//   if (edition_id) {
//     previewSession = classroomSessionsRef.push({ 'students': {'student': 'James Joyce'}, 'current_slide': '0', 'public': true, 'preview': true, 'edition_id': edition_id})
//   } else {
//     previewSession = classroomSessionsRef.push({ 'students': {'student': 'James Joyce'}, 'current_slide': '0', 'public': true, 'preview': true})
//   }
//   return previewSession.key
// }

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
  const reviewRef = reviewsRef.child(classroom_activity_id)
  const review = {
    activity_id: activity_id,
    value: value,
    classroom_activity_id: classroom_activity_id,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  }
  reviewRef.set(review)
}
