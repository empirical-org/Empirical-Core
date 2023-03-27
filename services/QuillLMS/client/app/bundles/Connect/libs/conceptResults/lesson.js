import {
    getConceptResultsForSentenceCombining
} from './sentenceCombiningLessonQuestion';

import {
    getAllSentenceFragmentConceptResults
} from './sentenceFragment.js';

import {
    getConceptResultsForFillInTheBlanks
} from './fillInTheBlanks';

import _ from 'underscore';

const scoresForNAttempts = {
  1: 1,
  2: 0.8,
  3: 0.6,
  4: 0.4,
  5: 0.2,
};

export function getConceptResultsForQuestion(questionObj) {
  if (questionObj.type === 'SF') {
    return getAllSentenceFragmentConceptResults(questionObj.question);
  } else if (questionObj.type === 'SC') {
    return getConceptResultsForSentenceCombining(questionObj.question);
  } else if (questionObj.type === 'FB') {
    return getConceptResultsForFillInTheBlanks(questionObj.question);
  }
}

export function getNestedConceptResultsForAllQuestions(questions) {
  return questions.map(questionObj => getConceptResultsForQuestion(questionObj));
}

export function embedQuestionNumbers(nestedConceptResultArray) {
  return nestedConceptResultArray.map((conceptResultArray, index) => {
    const lastAttempt = _.sortBy(conceptResultArray, (conceptResult) => {
      return conceptResult.metadata.attemptNumber;
    }).reverse()[0]
    const maxAttemptNo = lastAttempt && lastAttempt.metadata.correct ? lastAttempt.metadata.attemptNumber : undefined;
    const questionScore = scoresForNAttempts[maxAttemptNo] || 0;
    return conceptResultArray.map((conceptResult) => {
      conceptResult.metadata.questionNumber = index + 1;
      conceptResult.metadata.questionScore = questionScore
      return conceptResult;
    })
  });
}

export function getConceptResultsForAllQuestions(questions) {
  const nested = getNestedConceptResultsForAllQuestions(questions);
  const withKeys = embedQuestionNumbers(nested);
  return [].concat.apply([], withKeys); // Flatten array
}

export function getScoreForSentenceCombining(question) {
  if (!question.attempts.find(attempt => attempt.response.optimal)) { return 0 }
  return scoresForNAttempts[question.attempts.length] || 0
}

export function getScoreForSentenceFragment(question) {
  if (!question.attempts.find(attempt => attempt.response.optimal)) { return 0 }
  return scoresForNAttempts[question.attempts.length] || 0
}

export function calculateScoreForLesson(questions) {
  let correct = 0;
  questions.forEach((question) => {
    switch (question.type) {
      case 'SF':
        correct += getScoreForSentenceFragment(question.question);
        break;
      case 'SC':
      case 'FB':
        correct += getScoreForSentenceCombining(question.question);
        break;
      default:
        throw new Error('question is not compatible type');
    }
  });
  return Math.round((correct / questions.length) * 100) / 100;
}
