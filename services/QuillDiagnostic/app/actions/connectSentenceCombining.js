const C = require('../constants').default;

import rootRef from '../libs/firebase';

const	questionsRef = rootRef.child('questions');

export function startListeningToConnectQuestions() {
  return (dispatch, getState) => {
    questionsRef.on('value', (snapshot) => {
      dispatch({ type: C.RECEIVE_CONNECT_QUESTIONS_DATA, data: snapshot.val(), });
    });
  };
}
