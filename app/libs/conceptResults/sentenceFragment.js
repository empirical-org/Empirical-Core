import C from '../../constants';
import _ from 'underscore';

import { getConceptResultsForAttempt } from './sharedConceptResultsFunctions';

export function getIdentificationConceptResult(question) {
  console.log('identifying');
  const returnValue = {};
  const correct = question.identified ? 1 : 0;
  const prompt = question.questionText;
  const directions = 'Is this a sentence or a fragment?';
  let answer,
    concept_uid;
  if (question.isFragment) {
    answer = question.identified ? 'Fragment' : 'Sentence';
    concept_uid = 'j89kdRGDVjG8j37A12p37Q';
  } else {
    answer = question.identified ? 'Sentence' : 'Fragment';
    concept_uid = 'LH3szu784pXA5k2N9lxgdA';
  }
  returnValue.concept_uid = concept_uid;
  returnValue.question_type = 'sentence-fragment-identification';
  returnValue.metadata = {
    correct,
    directions,
    prompt,
    answer,
  };
  console.log(returnValue);
  return returnValue;
}

export function getCompleteSentenceConceptResult(question) {
  const returnValue = {};
  const correct = calculateCorrectnessOfSentence(question.attempts[0]);
  const concept_uid = 'KfA8-dg8FvlJz4eY0PkekA';
  const answer = question.attempts[0].submitted;
  const directions = question.instructions || C.INSTRUCTIONS.sentenceFragments;
  const prompt = question.prompt;
  returnValue.concept_uid = concept_uid;
  returnValue.question_type = 'sentence-fragment-expansion';
  returnValue.metadata = {
    correct,
    directions,
    prompt,
    answer,
  };
  return returnValue;
}

export function getAllSentenceFragmentConceptResults(question) {
  let conceptResults;
  if (question.needsIdentification) {
    conceptResults = [
      getIdentificationConceptResult(question),
      getCompleteSentenceConceptResult(question)
    ];
  } else {
    conceptResults = [
      getCompleteSentenceConceptResult(question)
    ];
  }
  const nestedConceptResults = question.attempts.map((attempt, index) => getConceptResultsForSentenceFragmentAttempt(question, index));
  const flattenedNestedConceptResults = [].concat.apply([], nestedConceptResults); // Flatten nested Array
  return conceptResults.concat(flattenedNestedConceptResults);
}

export function getConceptResultsForSentenceFragmentAttempt(question, attemptIndex) {
  return getConceptResultsForAttempt(question, attemptIndex, 'sentence-fragment-expansion', 'Add/Remove words to make this a sentence');
}

export function calculateCorrectnessOfSentence(attempt) {
  if (attempt && attempt.response) {
    return attempt.response.optimal ? 1 : 0;
  } else {
    return 1;
  }
}
