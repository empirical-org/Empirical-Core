import rootRef from '../libs/firebase';
import { v4rootRef } from '../libs/firebase';
import questionActions from './questions';
import _ from 'lodash';

const C = require('../constants').default;

const sessionsRef = rootRef.child('savedSessions');
const v4sessionsRef = v4rootRef.child('connectSessions');
// There's probably a way to pull this from the Redux store since
// questions already get pulled into that at some point, but I don't
// know that untangling that particular flow is worth the time at
// this particular moment.  2019-09-05
let allQuestions = {};
questionActions.loadQuestions()((result) => {
  allQuestions = result.data;
  Object.keys(allQuestions).forEach((key) => {
    allQuestions[key]["key"] = key;
  });
});

export default {
  get(sessionID, cb) {
    // First attempt to get the new normalized session object for this ID
    v4sessionsRef.child(sessionID).once('value', (snapshot) => {
      if (snapshot.exists()) {
        const v4session = denormalizeSession(snapshot.val());
        handleSessionSnapshot(v4session, cb);
      } else {
        // If we can't find a new style session, look for an old one
        sessionsRef.child(sessionID).once('value', (snapshot) => {
          if (snapshot.exists()) {
            const v2session = snapshot.val();
            handleSessionSnapshot(v2session, cb);
          }
        });
      }
    });
  },

  update(sessionID, session) {
    const cleanSession = _.pickBy(session);
    const cleanedSession = JSON.parse(JSON.stringify(cleanSession));
    delete_null_properties(cleanedSession, true);
    const normalizedSession = normalizeSession(cleanedSession)
    v4sessionsRef.child(sessionID).set(normalizedSession);
  },

  delete(sessionID) {
    sessionsRef.child(sessionID).remove();
  },

};

function denormalizeSession(session) {
  session.answeredQuestions.forEach((value, index, answeredQuestions) => {
    let denormalizedQuestion = denormalizeQuestion(value.question);
    denormalizedQuestion.question.attempts = value.attempts;
    answeredQuestions[index] = denormalizedQuestion;
  });
  session.questionSet.forEach((value, index, questionSet) => {
    questionSet[index] = denormalizeQuestion(value);
  });
  session.unansweredQuestions.forEach((value, index, unansweredQuestions) => {
    unansweredQuestions[index] = denormalizeQuestion(value);
  });
  if (session.currentQuestion) {
    session.currentQuestion = denormalizeQuestion(session.currentQuestion);
  }
  return session
}

function denormalizeQuestion(question) {
  return {
    question: Object.assign({}, allQuestions[question]),
    type: "SC",
  }
}

function normalizeSession(session) {
  session.questionSet = session.questionSet.map(normalizeQuestion);
  session.unansweredQuestions = session.unansweredQuestions.map(normalizeQuestion);
  if (session.currentQuestion) {
    session.currentQuestion = normalizeQuestion(session.currentQuestion);
  }
  session.answeredQuestions = session.answeredQuestions.map((question) => {
    return {
      question: question.question.key,
      attempts: question.question.attempts,
    }
  });
  return session
}

function normalizeQuestion(question) {
  return question.question.key
}

function handleSessionSnapshot(session, callback) {
  if (session.currentQuestion) {
    if (session.currentQuestion.question) {
      session.currentQuestion.question.attempts = session.currentQuestion.question.attempts || [];
    } else {
      session.currentQuestion.data.attempts = session.currentQuestion.data.attempts || [];
    }
  }
  session.unansweredQuestions ? true : session.unansweredQuestions = [];
  callback(session);
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
