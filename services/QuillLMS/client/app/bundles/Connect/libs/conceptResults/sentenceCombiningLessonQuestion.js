import { getConceptResultsForAttempt } from './sharedConceptResultsFunctions';

const C = require('../../constants').default;

export function getConceptResultsForSentenceCombining(question) {
  const nestedConceptResults = question.attempts.map((attempt, index) => getConceptResultsForSentenceCombiningAttempt(question, index));
  return [].concat.apply([], nestedConceptResults); // Flatten nested Array
}

export function getConceptResultsForSentenceCombiningAttempt(question, attemptIndex) {
  return getConceptResultsForAttempt(question, attemptIndex, 'sentence-combining', 'Combine the sentences.');
}
