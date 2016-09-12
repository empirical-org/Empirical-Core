import React from 'react'
import _ from 'underscore'

const feedbackStrings = {
  punctuationError: "There may be an error. How could you update the punctuation?",
  punctuationAndCaseError: "There may be an error. How could you update the punctuation and capitalization?",
  typingError: "Try again. There may be a spelling mistake.",
  caseError: "Try again. There may be a capitalization error.",
  minLengthError: "Try again. Do you have all of the information from the prompt?",
  maxLengthError: "Try again. How could this sentence be shorter and more concise?",
  modifiedWordError: "Try again. You may have mixed up a word?",
  additionalWordError: "Try again. You may have added an unnecessary a word?",
  missingWordError: "Try again. You may have forgotten a word?",
}

export default function generateFeedbackString(attempt) {
  //getErrorsForAttempt function below
  const errors = _.pick(attempt, 'typingError', 'caseError', 'punctuationError', 'punctuationAndCaseError', 'minLengthError', 'maxLengthError', "modifiedWordError", "additionalWordError", "missingWordError");

  // add keys for react list elements
  var errorComponents = _.values(_.mapObject(errors, (val, key) => {
    if (val) {
      return feedbackStrings[key]
    }
  }))
  return errorComponents[0]
}
