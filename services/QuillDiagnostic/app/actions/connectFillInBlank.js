const C = require('../constants').default;

import rootRef from '../libs/firebase';

const	questionsRef = rootRef.child('fillInBlankQuestions');

export function startListeningToConnectFillInBlankQuestions() {
  return (dispatch, getState) => {
    questionsRef.on('value', (snapshot) => {
      dispatch({ type: C.RECEIVE_CONNECT_FILL_IN_BLANK_DATA, data: snapshot.val(), });
    });
  };
}
