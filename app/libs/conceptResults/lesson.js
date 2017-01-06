import {
  getConceptResultsForSentenceCombining
} from './sentenceCombiningLessonQuestion';

import {
  getAllSentenceFragmentConceptResults,
  calculateCorrectnessOfSentence
} from './sentenceFragment.js';

const scoresForNAttempts = {
  1: 1,
  2: 0.75,
  3: 0.5,
  4: 0.25,
  5: 0,
};

export function getConceptResultsForQuestion(questionObj) {
  if (questionObj.type === 'SF') {
    return getAllSentenceFragmentConceptResults(questionObj.question);
  } else if (questionObj.type === 'SC') {
    return getConceptResultsForSentenceCombining(questionObj.question);
  }
}

export function getNestedConceptResultsForAllQuestions(questions) {
  return questions.map(questionObj => getConceptResultsForQuestion(questionObj));
}

export function embedQuestionNumbers(nestedConceptResultArray) {
  return nestedConceptResultArray.map((conceptResultArray, index) => conceptResultArray.map((conceptResult) => {
    conceptResult.metadata.questionNumber = index + 1;
    return conceptResult;
  }));
}

export function getConceptResultsForAllQuestions(questions) {
  const nested = getNestedConceptResultsForAllQuestions(questions);
  const withKeys = embedQuestionNumbers(nested);
  return [].concat.apply([], withKeys); // Flatten array
}

export function getScoreForSentenceCombining(question) {
  return scoresForNAttempts[question.attempts.length] || 0
}
export function getScoreForSentenceFragment(question) {
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
        correct += getScoreForSentenceCombining(question.question);
        break;
      default:
        throw new Error('question is not compatible type');
    }
  });
  return Math.round((correct / questions.length) * 100) / 100;
}
