declare function require(name:string);
import  C from '../constants';
import rootRef, { firebase } from '../libs/firebase';
const classroomSessionsRef = rootRef.child('classroom_lesson_sessions');
const moment = require('moment');
import {
  ClassroomLessonSessions,
  ClassroomLessonSession,
  QuestionSubmissionsList,
  SelectedSubmissions,
  SelectedSubmissionsForQuestion,
  TeacherAndClassroomName
} from 'components/classroomLessons/interfaces';


export function startListeningToSession(classroom_activity_id: string) {
  return function (dispatch) {
    classroomSessionsRef.child(classroom_activity_id).on('value', (snapshot) => {
      dispatch(updateSession(snapshot.val()));
    });
  };
}

export function toggleOnlyShowHeaders() {
  return function (dispatch) {
    dispatch({type: C.TOGGLE_HEADERS})
  }
}

export function updateSession(data: object): {type: string; data: any;} {
  return {
    type: C.UPDATE_CLASSROOM_SESSION_DATA,
    data,
  };
}

export function registerPresence(classroom_activity_id: string, student_id: string): void {
  const presenceRef = classroomSessionsRef.child(`${classroom_activity_id}/presence/${student_id}`);
  firebase.database().ref('.info/connected').on('value', (snapshot) => {
    if (snapshot.val() === true) {
      presenceRef.onDisconnect().set(false);
      presenceRef.set(true);
    }
  });
}

export function goToNextSlide(classroom_activity_id: string, state: ClassroomLessonSession) {
  const { current_slide, questions, } = state;
  const slides = Object.keys(questions);
  const current_slide_index = slides.indexOf(current_slide.toString());
  console.log(current_slide_index);
  const nextSlide = slides[current_slide_index + 1];
  if (nextSlide !== undefined) {
    updateCurrentSlide(classroom_activity_id, nextSlide);
  }
}

export function updateCurrentSlide(classroom_activity_id: string, question_id: string): void {
  const currentSlideRef = classroomSessionsRef.child(`${classroom_activity_id}/current_slide`);
  currentSlideRef.set(question_id);
  setSlideStartTime(classroom_activity_id, question_id)
}

export function saveStudentSubmission(classroom_activity_id: string, question_id: string, student_id: string, submission: {data: any, timestamp: string}): void {
  const submissionRef = classroomSessionsRef.child(`${classroom_activity_id}/submissions/${question_id}/${student_id}`);
  submissionRef.set(submission);
}

export function clearAllSubmissions(classroom_activity_id: string, question_id: string): void {
  const submissionRef = classroomSessionsRef.child(`${classroom_activity_id}/submissions/${question_id}`);
  submissionRef.remove()
}

export function saveSelectedStudentSubmission(classroom_activity_id: string, question_id: string, student_id: string): void {
  const selectedSubmissionRef = classroomSessionsRef.child(`${classroom_activity_id}/selected_submissions/${question_id}/${student_id}`);
  selectedSubmissionRef.set(true);
}

export function removeSelectedStudentSubmission(classroom_activity_id: string, question_id: string, student_id: string): void {
  const selectedSubmissionRef = classroomSessionsRef.child(`${classroom_activity_id}/selected_submissions/${question_id}/${student_id}`);
  selectedSubmissionRef.remove();
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

export function toggleStudentFlag(classroomActivityId: string|null, student_id: string): void {
  const flaggedStudentRef = classroomSessionsRef.child(`${classroomActivityId}/flaggedStudents/${student_id}`)
  flaggedStudentRef.once('value', (snapshot) => {
    if(snapshot.val()){
      flaggedStudentRef.remove()
    } else {
      flaggedStudentRef.set(true)
    }
  }
}

export function getClassroomAndTeacherNameFromServer(classroom_activity_id: string, baseUrl: string) {
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

function _setClassroomName(classroomName: string, classroom_activity_id: string) {
  const classroomNameRef = classroomSessionsRef.child(`${classroom_activity_id}/classroom_name`);
  classroomNameRef.set(classroomName)
}

function _setTeacherName(teacherName: string, classroom_activity_id: string) {
  const teacherNameRef = classroomSessionsRef.child(`${classroom_activity_id}/teacher_name`);
  teacherNameRef.set(teacherName)
}

function _setClassroomAndTeacherName(names: TeacherAndClassroomName, classroom_activity_id: string): void {
  _setClassroomName(names.classroom, classroom_activity_id)
  _setTeacherName(names.teacher, classroom_activity_id)
}

export function addStudentNames(classroom_activity_id: string, studentsNames: object): void {
  const studentsRef = classroomSessionsRef.child(`${classroom_activity_id}/students`);
  studentsRef.set(studentsNames)
}

export function setSlideStartTime(classroom_activity_id: string, question_id: string): void {
  const timestampRef = classroomSessionsRef.child(`${classroom_activity_id}/timestamps/${question_id}`);
  console.log('question_id', question_id)
  timestampRef.on('value', (snapshot) => {
    if (snapshot.val() === null) {
      timestampRef.set(moment().format())
    }
  });
}
