const C = require('../constants').default;
import rootRef from '../libs/firebase';
import _ from 'lodash';
const sessionsRef = rootRef.child('savedSessions');

export default {
  get(sessionID, cb) {
    sessionsRef.child(sessionID).once('value', (snapshot) => {
      if (snapshot.exists()) {
        const session = snapshot.val();
        if (session.currentQuestion) {
          if (session.currentQuestion.question) {
            session.currentQuestion.question.attempts = [];
          } else {
            session.currentQuestion.data.attempts = [];
          }
        }
        session.unansweredQuestions ? true : session.unansweredQuestions = [];
        cb(session);
      }
    });
  },

  update(sessionID, session) {
    // delete_null_properties(session, true)
    // console.log(session);
    console.log(_.pickBy(session));
    sessionsRef.child(sessionID).set(_.pickBy(session));
  },

  delete(sessionID) {
    sessionsRef.child(sessionID).remove();
  },

};

function delete_null_properties(test, recurse) {
  for (const i in test) {
    if (test[i] === null) {
      delete test[i];
    } else if (recurse && typeof test[i] === 'object') {
      delete_null_properties(test[i], recurse);
    }
  }
}
