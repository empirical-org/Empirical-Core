import rootRef from '../libs/firebase';
import _ from 'lodash';

import { SessionApi } from '../libs/sessions_api';

const C = require('../constants').default;

const sessionsRef = rootRef.child('savedSessions');

export default {
  get(sessionID, callback) {
    SessionApi.get(sessionID).then((session) => {
      const processedSession = processSession(session)
      callback(processedSession)
    }).catch((error) => {
      sessionsRef.child(sessionID).once('value', (snapshot) => {
        if (snapshot.exists()) {
          const session = snapshot.val();
          const processedSession = processSession(session)
          callback(processedSession);
        }
      })
    })
  },

  update(sessionID, session) {
    const cleanSession = _.pickBy(session);
    const cleanedSession = JSON.parse(JSON.stringify(cleanSession));
    delete_null_properties(cleanedSession, true);
    SessionApi.update(sessionID, cleanedSession);
  },

  delete(sessionID) {
    sessionsRef.child(sessionID).remove();
  },

};

function processSession(session) {
  if (session.currentQuestion) {
    if (session.currentQuestion.question) {
      session.currentQuestion.question.attempts = [];
    } else {
      session.currentQuestion.data.attempts = [];
    }
  }
  session.unansweredQuestions = session.unansweredQuestions || [];
  return session
}

function delete_null_properties(test, recurse) {
  for (const i in test) {
    if (test[i] === null) {
      delete test[i];
    } else if (recurse && typeof test[i] === 'object') {
      delete_null_properties(test[i], recurse);
    }
  }
}
