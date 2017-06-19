const C = require('../constants').default;
import rootRef, { firebase } from '../libs/firebase';
const classroomSessionsRef = rootRef.child('classroom_lesson_sessions');

export function startListeningToSession(classroom_activity_id) {
  console.log('Called function: ', classroom_activity_id);
  return function (dispatch) {
    classroomSessionsRef.child(classroom_activity_id).on('value', (snapshot) => {
      dispatch(updateSession(snapshot.val()));
    });
  };
}

export function updateSession(data) {
  return {
    type: C.UPDATE_CLASSROOM_SESSION_DATA,
    data,
  };
}

export function registerPresence(classroom_activity_id, student_id) {
  const presenceRef = classroomSessionsRef.child(`${classroom_activity_id}/presence/${student_id}`);
  firebase.database().ref('.info/connected').on('value', (snapshot) => {
    console.log('val', snapshot.val());
    if (snapshot.val() === true) {
      console.log('True');
      presenceRef.onDisconnect().remove();
      presenceRef.set(true);
    }
  });
}

export function updateCurrentSlide(classroom_activity_id, question_id) {
  const currentSlideRef = classroomSessionsRef.child(`${classroom_activity_id}/current_slide`);
  currentSlideRef.set(question_id);
}

export function saveStudentSubmission(classroom_activity_id, question_id, student_id, submission) {
  const submissionRef = classroomSessionsRef.child(`${classroom_activity_id}/submissions/${question_id}/${student_id}`);
  const submissionRef.set(submission)
}

export function saveSelectedStudentSubmission(classroom_activity_id, question_id, student_id) {
  const selectedSubmissionRef = classroomSessionsRef.child(`${classroom_activity_id}/selected_submissions/${question_id}/${student_id}`);
  const selectedSubmissionRef.set(true);
}

export function removeSelectedStudentSubmission(classroom_activity_id, question_id, student_id) {
  const selectedSubmissionRef = classroomSessionsRef.child(`${classroom_activity_id}/selected_submissions/${question_id}/${student_id}`);
  selectedSubmissionRef.remove();
}
