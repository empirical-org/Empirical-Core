import C from '../../constants';
import _ from 'underscore';

import { getConceptResultsForAttempt } from './sharedConceptResultsFunctions';

export function getIdentificationConceptResult(question) {
  const returnValue = {};
  const correct = question.identified ? 1 : 0;
  const prompt = question.prompt;
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
    attemptNumber: 1,
  };
  return returnValue;
}

export function getCompleteSentenceConceptResult(question) {
  const returnValue = {};
  const correct = calculateCorrectnessOfSentence(question.attempts[0]);
  const concept_uid = 'KfA8-dg8FvlJz4eY0PkekA';
  const answer = question.attempts[0].response.text;
  const directions = question.instructions || C.INSTRUCTIONS.sentenceFragments;
  const prompt = question.prompt;
  returnValue.concept_uid = concept_uid;
  returnValue.question_type = 'sentence-fragment-expansion';
  returnValue.metadata = {
    correct,
    directions,
    prompt,
    answer,
    attemptNumber: 1,
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
  const defaultDirections = 'Add/change as few words as you can to change this fragment into a sentence.';
  const conceptResults = getConceptResultsForAttempt(question, attemptIndex, 'sentence-fragment-expansion', defaultDirections);
  return _.compact(conceptResults);
}

export function calculateCorrectnessOfSentence(attempt) {
  if (attempt && attempt.response && attempt.response.optimal !== undefined) {
    return attempt.response.optimal ? 1 : 0;
  } 
  return 1;
  
}
