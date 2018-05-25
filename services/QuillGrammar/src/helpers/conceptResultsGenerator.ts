import {hashToCollection} from './hashToCollection'
import _ from 'underscore'

import { ConceptResult } from 'quill-marking-logic'
import { Question } from '../interfaces/questions'

export function getConceptResultsForQuestion(question: Question) {
  const prompt = question.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '');
  const answer = question.attempts[0].text;
  let conceptResults = [];
  if (question.attempts[0]) {
    conceptResults = question.attempts[0].concept_results || [];
  } else {
    conceptResults = [];
  }
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
  let directions = question.instructions;
  return conceptResults.map((conceptResult: ConceptResult) => {
    return {
    concept_uid: conceptResult.conceptUID,
    question_type: 'sentence-writing',
    metadata: {
      correct: conceptResult.correct ? 1 : 0,
      directions,
      prompt,
      answer,
      question_uid:  question.uid
    },
  }});
}

export function getNestedConceptResultsForAllQuestions(questions) {
  console.log('questions', questions)
  return questions.map(questionObj => getConceptResultsForQuestion(questionObj));
}

export function embedQuestionNumbers(nestedConceptResultArray) {
  return nestedConceptResultArray.map((conceptResultArray, index) => {
    return conceptResultArray.map((conceptResult) => {
      conceptResult.metadata.questionNumber = index + 1;
      conceptResult.metadata.questionScore = conceptResult.metadata.correct ? 1 : 0
      console.log('conceptResult', conceptResult)
      return conceptResult;
    })
  });
}

export function getConceptResultsForAllQuestions(questions: Array<Question>) {
  const nested = getNestedConceptResultsForAllQuestions(questions);
  const withKeys = embedQuestionNumbers(nested);
  return [].concat.apply([], withKeys); // Flatten array
}

export function calculateScoreForLesson(questions) {
  let correct = 0;
  questions.forEach((question) => {
    correct += question.attempts.find((a) => a.optimal) ? 1 : 0
  });
  return Math.round((correct / questions.length) * 100) / 100;
}
