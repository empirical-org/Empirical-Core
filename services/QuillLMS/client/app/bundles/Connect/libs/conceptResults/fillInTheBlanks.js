import { getConceptResultsForAttempt } from './sharedConceptResultsFunctions';

import { hashToCollection, } from '../../../Shared/index';
import { formattedCues } from '../formattedCues';

export function getConceptResultsForFillInTheBlanks(question) {
  const nestedConceptResults = question.attempts.map((attempt, index) => getConceptResultsForFillInTheBlanksAttempt(question, index));
  return [].concat.apply([], nestedConceptResults); // Flatten nested Array
}

export function getConceptResultsForFillInTheBlanksAttempt(question, attemptIndex) {
  let directions = question.instructions || 'Fill in the blanks.'

  if (question.cues && question.cues[0] !== '') {
    directions += ` ${formattedCues(question.cues)}`;
  }
  return getConceptResultsForAttempt(question, attemptIndex, 'fill-in-the-blanks', directions);
}
