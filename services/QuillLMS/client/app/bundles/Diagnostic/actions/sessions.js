import _ from 'lodash';

import { SessionApi } from '../libs/sessions_api';

const C = require('../constants').default;

let allQuestions = {};
let questionsInitialized = {};

export default {
  get(sessionID, callback) {
    SessionApi.get(sessionID).then((session) => {
      const denormalizedSession = denormalizeSession(session)
      const processedSession = processSession(denormalizedSession)
      callback(processedSession)
    }).catch((error) => {
      if (error.status === 404) {
        const processedSession = processSession(null)
        callback(processedSession)
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
    SessionApi.update(sessionID, normalizedSession);
  },

  populateQuestions(questionType, questions, forceRefresh) {
    if (questionsInitialized[questionType] && !forceRefresh) return;

    Object.keys(questions).forEach((uid) => {
      allQuestions[uid] = {
        data: Object.assign(questions[uid], {key: uid}),
        type: questionType,
      }
    })
    questionsInitialized[questionType] = true;
  }
};

function processSession(session) {
  if (session != null) {
    if (session.currentQuestion) {
      if (session.currentQuestion.question) {
        session.currentQuestion.question.attempts = [];
      } else {
        session.currentQuestion.data.attempts = [];
      }
    }
    session.unansweredQuestions = session.unansweredQuestions || [];
  }
  return session
}

function denormalizeSession(session) {
  // If the session is already in a denormalized form (it has question keys that
  // contain objects instead of just an ID string, just return the session as-is
  if (typeof session.questionSet[0].data == "object") return session
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
  const denormalizedQuestion = JSON.parse(JSON.stringify(allQuestions[questionUid]))
  const questionType = allQuestions[questionUid].type;
  if (question.attempts) {
    denormalizedQuestion.data.attempts = question.attempts;
  }
  return denormalizedQuestion
}

function normalizeSession(session) {
  // Deep copy so that we return a clean object
  let sessionCopy = JSON.parse(JSON.stringify(session));
  sessionCopy.questionSet = sessionCopy.questionSet.map(normalizeQuestion)
  // If someone has answered all the questions, key will be missing
  if (sessionCopy.unansweredQuestions) {
    sessionCopy.unansweredQuestions = sessionCopy.unansweredQuestions.map(normalizeQuestion)
  }
  if (sessionCopy.currentQuestion) {
    sessionCopy.currentQuestion = normalizeQuestionWithAttempts(sessionCopy.currentQuestion);
  }
  // If someone has not answered any questions, this key will be missing
  if (sessionCopy.answeredQuestions) {
    sessionCopy.answeredQuestions = sessionCopy.answeredQuestions.map(normalizeQuestionWithAttempts)
  }
  return sessionCopy
}

function normalizeQuestion(question) {
  return question.data.key;
}

function normalizeQuestionWithAttempts(question) {
  return {
    question: question.data.key,
    attempts: question.data.attempts,
  }
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

