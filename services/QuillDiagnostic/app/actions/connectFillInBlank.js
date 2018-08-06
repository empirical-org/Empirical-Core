const C = require('../constants').default;

import rootRef from '../libs/firebase';

const	connectFillInBlankRef = rootRef.child('fillInBlankQuestions');
const	diagnosticFillInBlankRef = rootRef.child('diagnostic_fillInBlankQuestions');

export function startListeningToConnectFillInBlankQuestions() {
  return (dispatch, getState) => {
    connectFillInBlankRef.on('value', (snapshot) => {
      dispatch({ type: C.RECEIVE_CONNECT_FILL_IN_BLANK_DATA, data: snapshot.val(), });
    });
  };
}

export function cloneConnectFillInBlankQuestion(uid: string) {
  connectFillInBlankRef.child(uid).on('value', (snapshot) => {
    const connectFillInBlankQuestion = snapshot ? snapshot.val() : null
    if (connectFillInBlankQuestion) {
      const diagnosticFillInBlankQuestion = diagnosticFillInBlankRef.push(connectFillInBlankQuestion)
    }
  });
}
