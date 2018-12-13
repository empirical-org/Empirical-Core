import { ConceptResult } from 'quill-marking-logic'
import { hashToCollection } from 'quill-component-library/dist/componentLibrary';
import * as _ from 'lodash'
import { Question, FormattedConceptResult, ResponseAttempt } from '../interfaces/questions'

const scoresForNAttempts = {
  1: 1,
  2: 0.5,
};

export function getConceptResultsForQuestion(question: Question): FormattedConceptResult[]|undefined {
  const prompt = question.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '');
  if (question.attempts) {
    return question.attempts.map((a, i) => getConceptResultsForAttempt(a, question, prompt, i)).flat(2)
  } else {
    return undefined
  }
}

function getConceptResultsForAttempt(attempt: ResponseAttempt, question: Question, prompt: string, index: Number):FormattedConceptResult[] {
  const answer = attempt.text;
  let conceptResults: ConceptResult[]|never = [];
  if (attempt) {
    const conceptResultObject = attempt.conceptResults || attempt.concept_results
    conceptResults = hashToCollection(conceptResultObject) || [];
  } else {
    conceptResults = [];
  }
  conceptResults = Array.isArray(conceptResults) ? conceptResults : _.values(conceptResults)
  if (conceptResults.length === 0) {
    conceptResults = [{
      conceptUID: question.concept_uid,
      correct: false,
    }];
  } else if (!conceptResults.find(cr => cr.conceptUID === question.concept_uid )) {
    conceptResults.push({
      conceptUID: question.concept_uid,
      correct: false,
    })
  }
  const directions = question.instructions;
  const attemptNumber = index + 1
  return conceptResults.map((conceptResult: ConceptResult) => {
    return {
      concept_uid: conceptResult.conceptUID,
      question_type: 'sentence-writing',
      metadata: {
        correct: conceptResult.correct ? 1 : 0,
        directions,
        prompt,
        answer,
        attemptNumber,
        question_uid:  question.uid
      },
    }});
}

export function getNestedConceptResultsForAllQuestions(questions: Question[]) {
  return questions.map(questionObj => getConceptResultsForQuestion(questionObj));
}

export function embedQuestionNumbers(nestedConceptResultArray: FormattedConceptResult[][], startingNumber: number): FormattedConceptResult[][] {
  return nestedConceptResultArray.map((conceptResultArray, index) => {
    return conceptResultArray.map((conceptResult: FormattedConceptResult) => {
      conceptResult.metadata.questionNumber = startingNumber + index + 1;
      conceptResult.metadata.questionScore = conceptResult.metadata.correct ? 1 : 0
      return conceptResult;
    })
  });
}

export function getConceptResultsForAllQuestions(questions: Question[], startingNumber:number = 0): FormattedConceptResult[] {
  const nested = getNestedConceptResultsForAllQuestions(questions);
  const withKeys = embedQuestionNumbers(nested, startingNumber);
  return [].concat.apply([], withKeys); // Flatten array
}

export function calculateScoreForLesson(questions: Question[]) {
  let correct = 0;
  questions.forEach((question) => {
    if (question.attempts) {
      correct += question.attempts.find((a) => !!a.optimal) ? 1 : 0
    }
  });
  return Math.round((correct / questions.length) * 100) / 100;
}
