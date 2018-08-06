const C = require('../constants').default;

import rootRef from '../libs/firebase';

const	questionsRef = rootRef.child('sentenceFragments');

export function startListeningToConnectSentenceFragments() {
  return (dispatch, getState) => {
    questionsRef.on('value', (snapshot) => {
      dispatch({ type: C.RECEIVE_CONNECT_SENTENCE_FRAGMENT_DATA, data: snapshot.val(), });
    });
  };
}
