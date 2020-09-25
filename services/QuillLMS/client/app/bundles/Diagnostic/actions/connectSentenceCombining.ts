const C = require('../constants').default;

import request from 'request'

import rootRef from '../libs/firebase';

const	connectSentenceCombiningRef = rootRef.child('questions');
const	diagnosticSentenceCombiningRef = rootRef.child('diagnostic_questions');

export function startListeningToConnectQuestions() {
  return (dispatch, getState) => {
    connectSentenceCombiningRef.on('value', (snapshot) => {
      if (snapshot) {
        dispatch({ type: C.RECEIVE_CONNECT_QUESTIONS_DATA, data: snapshot.val(), });
      }
    });
  };
}

export function cloneConnectSentenceCombiningQuestion(uid: string) {
  return (dispatch) => {
    connectSentenceCombiningRef.child(uid).on('value', (snapshot) => {
      const connectSentenceCombiningQuestion = snapshot ? snapshot.val() : null
      if (connectSentenceCombiningQuestion) {
        const diagnosticSentenceCombiningQuestion = diagnosticSentenceCombiningRef.push(connectSentenceCombiningQuestion)
        request(
          {
            url: `${process.env.QUILL_CMS}/responses/clone_responses`,
            method: 'POST',
            json: { original_question_uid: uid, new_question_uid: diagnosticSentenceCombiningQuestion.key, }
          },
          (err, httpResponse, data) => {
            if (err) {
              dispatch({ type: C.ERROR_CLONING_CONNECT_SENTENCE_COMBINING_QUESTION })
            } else {
              dispatch({ type: C.SUCCESSFULLY_CLONED_CONNECT_SENTENCE_COMBINING_QUESTION })
            }
          }
        );
      }
    });
  }
}
