const C = require('../constants').default;
import rootRef from '../libs/firebase';
const	diagnosticLessonsRef = rootRef.child('diagnostics');

	// called when the app starts. this means we immediately download all quotes, and
	// then receive all quotes again as soon as anyone changes anything.

  function startListeningToDiagnosticLessons() {
    return function (dispatch, getState) {
      diagnosticLessonsRef.on('value', (snapshot) => {
        dispatch({ type: C.RECEIVE_DIAGNOSTIC_LESSONS_DATA, data: snapshot.val(), });
      });
    };
  }

  function loadDiagnosticLessons() {
    return function (dispatch, getState) {
      diagnosticLessonsRef.once('value', (snapshot) => {
        dispatch({ type: C.RECEIVE_DIAGNOSTIC_LESSONS_DATA, data: snapshot.val(), });
      });
    };
  }


export default {
  startListeningToDiagnosticLessons,
  loadDiagnosticLessons,
};
