import {hashToCollection} from '../hashToCollection'
import _ from 'underscore'
var C = require("../../constants").default

export function getConceptResultsForSentenceCombining(question) {
  const nestedConceptResults = question.attempts.map((attempt, index) => {
    return getConceptResultsForSentenceCombiningAttempt(question, index)
  })

  return [].concat.apply([], nestedConceptResults) // Flatten nested Array
}

export function getConceptResultsForSentenceCombiningAttempt(question, attemptIndex) {
  let directions;
  if (attemptIndex > 0) {
    directions = question.attempts[attemptIndex - 1].feedback
  } else {
    directions = question.instructions || "Combine the sentences."
  }
  const prompt = question.prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")
  const answer = question.attempts[attemptIndex].submitted;
  const attemptNumber = attemptIndex + 1;
  let conceptResults = [];
  if (question.attempts[attemptIndex].response) {
    if (errorFree(question.attempts[attemptIndex])) {
      conceptResults = hashToCollection(question.attempts[attemptIndex].response.conceptResults) || []
    } else {
      conceptResults = [];
    }
  } else {
    conceptResults = [];
  }
  if (conceptResults.length === 0) {
    conceptResults = [{
      conceptUID: question.conceptID,
      correct: false
    }]
  }
  return conceptResults.map((conceptResult) => {
    return {
      concept_uid: conceptResult.conceptUID,
      metadata: {
        correct: conceptResult.correct ? 1 : 0,
        directions,
        prompt,
        attemptNumber,
        answer
      }
    }
  })
}

function getErrorsForAttempt (attempt) {
  return _.pick(attempt, ...C.ERROR_TYPES)
}

export function errorFree (attempt) {
  const errors = getErrorsForAttempt(attempt);
  return Object.keys(errors).length === 0
}
