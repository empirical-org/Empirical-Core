const C = require('../constants').default;

import rootRef from '../libs/firebase';

const	connectSentenceCombiningRef = rootRef.child('questions');
const	diagnosticSentenceCombiningRef = rootRef.child('diagnostic_questions');

export function startListeningToConnectQuestions() {
  return (dispatch, getState) => {
    connectSentenceCombiningRef.on('value', (snapshot) => {
      dispatch({ type: C.RECEIVE_CONNECT_QUESTIONS_DATA, data: snapshot.val(), });
    });
  };
}

export function cloneConnectSentenceCombiningQuestion(uid: string) {
  connectSentenceCombiningRef.child(uid).on('value', (snapshot) => {
    const connectSentenceCombiningQuestion = snapshot ? snapshot.val() : null
    if (connectSentenceCombiningQuestion) {
      const diagnosticSentenceCombiningQuestion = diagnosticSentenceCombiningRef.push(connectSentenceCombiningQuestion)
    }
  });
}
