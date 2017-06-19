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
      presenceRef.set(true);
      presenceRef.onDisconnect().remove();
    }
  });
}
