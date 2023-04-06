
import _ from 'lodash';
import { SessionApi } from '../libs/sessions_api';

const C = require('../constants').default;

let allQuestions = {};
let questionsInitialized = {};

export default {
  get(sessionID, cb) {
    // First attempt to get the new normalized session object for this ID
    SessionApi.get(sessionID).then((session) => {
      handleSessionSnapshot(denormalizeSession(session), cb)
    }).catch((error) => {
      if (error.status === 404) {
        handleSessionSnapshot(null, cb)
      } else {
        throw error
      }
    })
  },

  update(sessionID, session) {
    const cleanSession = _.pickBy(session);
    const cleanedSession = JSON.parse(JSON.stringify(cleanSession));
    delete_null_properties(cleanedSession, true);

    const normalizedSession = normalizeSession(cleanedSession)
    // Let's start including an updated time on our sessions
    normalizedSession.updatedAt = new Date().getTime();
    SessionApi.update(sessionID, normalizedSession);
  },

  populateQuestions(questionType, questions, forceRefresh) {
    if (questionsInitialized[questionType] && !forceRefresh) return;

    Object.keys(questions).forEach((uid) => {
      allQuestions[uid] = {
        question: Object.assign(questions[uid], {key: uid}),
        type: questionType,
      }
    })
    questionsInitialized[questionType] = true;
  }

};

function denormalizeSession(session) {
  // If someone has answered no questions, this key will be missing
  if (session.answeredQuestions) {
    session.answeredQuestions.forEach((value, index, answeredQuestions) => {
      answeredQuestions[index] = denormalizeQuestion(value);
    });
  }
  session.questionSet.forEach((value, index, questionSet) => {
    questionSet[index] = denormalizeQuestion(value);
  });
  // If all questions are answered, we won't have this key
  if (session.unansweredQuestions) {
    session.unansweredQuestions.forEach((value, index, unansweredQuestions) => {
      unansweredQuestions[index] = denormalizeQuestion(value);
    });
  }
  if (session.currentQuestion) {
    session.currentQuestion = denormalizeQuestion(session.currentQuestion);
  }
  return session
}

function denormalizeQuestion(question) {
  // Questions stored on the session object have a different shape
  // if they have any attempt data attached to them
  // It appears that they also have this shape if the object has ever
  // had attempt data on it.  This is only happens with currentQuestion,
  // but we should account for it
  const questionUid = (question.attempts || question.question) ? question.question : question;
  // We need to make sure that the 'question' part of the
  // question object is a clean copy so that we can modify
  // it without changing the cached question object
  const denormalizedQuestion = JSON.parse(JSON.stringify(allQuestions[questionUid].question))
  const questionType = allQuestions[questionUid].type;
  if (question.attempts) {
    denormalizedQuestion.attempts = question.attempts;
  }
  return {
    question: denormalizedQuestion,
    type: questionType,
  }
}

function normalizeSession(session) {
  // Deep copy so that we return a clean object
  let sessionCopy = JSON.parse(JSON.stringify(session));
  sessionCopy.questionSet = sessionCopy.questionSet.map(normalizeQuestion);
  // If someone has answered all the questions, key will be missing
  if (sessionCopy.unansweredQuestions) {
    sessionCopy.unansweredQuestions = sessionCopy.unansweredQuestions.map(normalizeQuestion);
  }
  if (sessionCopy.currentQuestion) {
    sessionCopy.currentQuestion = normalizeQuestion(sessionCopy.currentQuestion);
  }
  // If someone has not answered any questions, this key will be missing
  if (sessionCopy.answeredQuestions) {
    sessionCopy.answeredQuestions = sessionCopy.answeredQuestions.map(normalizeQuestion);
  }
  return sessionCopy
}

function normalizeQuestion(question) {
  if (!question.question.attempts) return question.question.key;
  return {
    question: question.question.key,
    attempts: question.question.attempts,
  }
}

function handleSessionSnapshot(session, callback) {
  if (session != null) {
    if (session.currentQuestion) {
      if (session.currentQuestion.question) {
        session.currentQuestion.question.attempts = session.currentQuestion.question.attempts || [];
      } else {
        session.currentQuestion.data.attempts = session.currentQuestion.data.attempts || [];
      }
    }
    session.unansweredQuestions ? true : session.unansweredQuestions = [];
  }
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

export {
    denormalizeSession,
    normalizeSession,
    allQuestions,
};

