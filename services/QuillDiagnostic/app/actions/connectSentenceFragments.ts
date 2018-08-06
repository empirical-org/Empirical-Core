const C = require('../constants').default;

import rootRef from '../libs/firebase';

const	connectSentenceFragmentsRef = rootRef.child('sentenceFragments');
const	diagnosticSentenceFragmentsRef = rootRef.child('diagnostic_sentenceFragments');

export function startListeningToConnectSentenceFragments() {
  return (dispatch, getState) => {
    connectSentenceFragmentsRef.on('value', (snapshot) => {
      dispatch({ type: C.RECEIVE_CONNECT_SENTENCE_FRAGMENT_DATA, data: snapshot.val(), });
    });
  };
}

export function cloneConnectSentenceFragment(uid: string) {
  connectSentenceFragmentsRef.child(uid).on('value', (snapshot) => {
    const connectSentenceFragment = snapshot ? snapshot.val() : null
    if (connectSentenceFragment) {
      const diagnosticSentenceFragment = diagnosticSentenceFragmentsRef.push(connectSentenceFragment)
    }
  });
}
