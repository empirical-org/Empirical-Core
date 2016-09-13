import React from 'react'
import _ from 'underscore'
import {FEEDBACK_STRINGS} from '../../constants.js'


const feedbackStrings = FEEDBACK_STRINGS

export default function generateFeedbackString(attempt) {
  //getErrorsForAttempt function below
  const errors = _.pick(attempt, 'typingError', 'caseError', 'punctuationError', 'punctuationAndCaseError', 'minLengthError', 'maxLengthError', "modifiedWordError", "additionalWordError", "missingWordError", "whitespaceError");

  // add keys for react list elements
  var errorComponents = _.values(_.mapObject(errors, (val, key) => {
    if (val) {
      return feedbackStrings[key]
    }
  }))
  return errorComponents[0]
}
