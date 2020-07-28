const C = require('../constants').default;
import request from 'request'

import rootRef from '../libs/firebase';

const	connectSentenceFragmentsRef = rootRef.child('sentenceFragments');
const	diagnosticSentenceFragmentsRef = rootRef.child('diagnostic_sentenceFragments');

export function startListeningToConnectSentenceFragments() {
  return (dispatch, getState) => {
    connectSentenceFragmentsRef.on('value', (snapshot) => {
      if (snapshot) {
        dispatch({ type: C.RECEIVE_CONNECT_SENTENCE_FRAGMENT_DATA, data: snapshot.val(), });
      }
    });
  };
}

export function cloneConnectSentenceFragment(uid: string) {
  return (dispatch) => {
    connectSentenceFragmentsRef.child(uid).on('value', (snapshot) => {
      const connectSentenceFragment = snapshot ? snapshot.val() : null
      if (connectSentenceFragment) {
        const diagnosticSentenceFragment = diagnosticSentenceFragmentsRef.push(connectSentenceFragment)
        request(
          {
            url: `${process.env.QUILL_CMS}/responses/clone_responses`,
            method: 'POST',
            json: { original_question_uid: uid, new_question_uid: diagnosticSentenceFragment.key, }
          },
          (err, httpResponse, data) => {
            // check again for number in state
            // if equal to const set earlier, update the state
            // otherwise, do nothing
            if (err) {
              dispatch({ type: C.ERROR_CLONING_CONNECT_SENTENCE_FRAGMENT })
            } else {
              dispatch({ type: C.SUCCESSFULLY_CLONED_CONNECT_SENTENCE_FRAGMENT })
            }
          }
        );
      }
    });
  }
}
