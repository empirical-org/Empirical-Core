const C = require('../constants').default;

import rootRef from '../libs/firebase';

import request from 'request'

const	connectFillInBlankRef = rootRef.child('fillInBlankQuestions');
const	diagnosticFillInBlankRef = rootRef.child('diagnostic_fillInBlankQuestions');

export function startListeningToConnectFillInBlankQuestions() {
  return (dispatch, getState) => {
    connectFillInBlankRef.on('value', (snapshot) => {
      if (snapshot) {
        dispatch({ type: C.RECEIVE_CONNECT_FILL_IN_BLANK_DATA, data: snapshot.val(), });
      }
    });
  };
}

export function cloneConnectFillInBlankQuestion(uid: string) {
  return (dispatch) => {
    connectFillInBlankRef.child(uid).on('value', (snapshot) => {
      const connectFillInBlankQuestion = snapshot ? snapshot.val() : null
      if (connectFillInBlankQuestion) {
        const diagnosticFillInBlankQuestion = diagnosticFillInBlankRef.push(connectFillInBlankQuestion)
        request(
          {
            url: `${process.env.QUILL_CMS}/responses/clone_responses`,
            method: 'POST',
            json: { original_question_uid: uid, new_question_uid: diagnosticFillInBlankQuestion.key, }
          },
          (err, httpResponse, data) => {
            // check again for number in state
            // if equal to const set earlier, update the state
            // otherwise, do nothing
            if (err) {
              dispatch({ type: C.ERROR_CLONING_CONNECT_FILL_IN_BLANK_QUESTION })
            } else {
              dispatch({ type: C.SUCCESSFULLY_CLONED_CONNECT_FILL_IN_BLANK_QUESTION })
            }
          }
        );
      }
    });
  }
}
