import { ConceptResult } from 'quill-marking-logic'
import * as _ from 'lodash'
import { Question, FormattedConceptResult, ResponseAttempt } from '../interfaces/questions'
import { hashToCollection } from '../../Shared/index'

const scoresForNAttempts: { [key:number]: number} = {
  1: 1,
  2: 0.75,
  3: 0.5,
  4: 0.25,
  5: 0,
};

export function getConceptResultsForQuestion(question: Question): FormattedConceptResult[]|undefined {
  const prompt = question.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '');
  if (question.attempts && question.attempts.length) {
    const conceptResults = question.attempts.map((a, i) => getConceptResultsForAttempt(a, question, prompt, i))
    if (conceptResults && conceptResults.length) {
      return _.flatten(conceptResults)
    } else {
      return undefined
    }
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
      correct: !!attempt.optimal
    }];
  }

  let directions = question.instructions

  if (index > 0) {
    directions = question.attempts[index - 1].feedback;
  }

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
  const nested = getNestedConceptResultsForAllQuestions(questions).filter(Boolean);
  const withKeys = embedQuestionNumbers(nested, startingNumber);
  return [].concat.apply([], withKeys); // Flatten array
}

export function getScoreForQuestion(question: Question): number {
  if (question.attempts) {
    return scoresForNAttempts[question.attempts.length] || 0
  }
  return 0
}

export function calculateScoreForLesson(questions: Question[]) {
  let correct = 0;
  questions.forEach((question) => {
    correct += getScoreForQuestion(question);
  });
  return Math.round((correct / questions.length) * 100) / 100;
}
