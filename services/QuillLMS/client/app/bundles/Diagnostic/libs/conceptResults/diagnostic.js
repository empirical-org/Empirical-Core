import {
    getConceptResultsForFillInTheBlanks
} from './fillInTheBlanks';
import {
    getConceptResultsForSentenceCombining
} from './sentenceCombining';
import {
    getAllSentenceFragmentConceptResults
} from './sentenceFragment';

export function getConceptResultsForQuestion(question) {
  if (question.type === 'SF') {
    return getAllSentenceFragmentConceptResults(question.data);
  } else if (question.type === 'SC') {
    return getConceptResultsForSentenceCombining(question.data);
  } else if (question.type === 'FB') {
    return getConceptResultsForFillInTheBlanks(question.data);
  }
}

export function getNestedConceptResultsForAllQuestions(questions) {
  return questions.filter(qs => qs.type !== 'TL').map(question => getConceptResultsForQuestion(question));
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
  return [].concat.apply([], withKeys);
}
