import _ from 'underscore'
let C = require("../../constants").default


const feedbackStrings = C.FEEDBACK_STRINGS

export default function generateFeedbackString(attempt) {
  //getErrorsForAttempt function below
  const errors = _.pick(attempt, ...C.ERROR_TYPES);

  // add keys for react list elements
  let errorComponents = _.values(_.mapObject(errors, (val, key) => {
    if (val) {
      return feedbackStrings[key]
    }
  }))
  return attempt.feedback
}
