const C = require('../constants').default;
import rootRef from '../libs/firebase';
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
