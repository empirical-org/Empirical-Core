const C = require('../constants').default;

import request from 'request'
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
      request(
        {
          url: `${process.env.QUILL_CMS}/responses/clone_responses`,
          method: 'POST',
          json: { original_question_uid: uid, new_question_uid: diagnosticSentenceCombiningQuestion.key, }
        },
        (err, httpResponse, data) => {
          // check again for number in state
          // if equal to const set earlier, update the state
          // otherwise, do nothing
          if (err) {
            console.log('uh oh', err)
          } else {
            console.log('yay', data)
          }
        }
      );
    }
  });
}
