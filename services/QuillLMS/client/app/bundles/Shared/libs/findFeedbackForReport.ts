export function findFeedbackForReport(attemptNum, conceptsByAttempt) {
  let currAttempt = conceptsByAttempt[attemptNum]
  let nextAttempt = conceptsByAttempt[attemptNum + 1]

  let feedback = false

  if (nextAttempt) {
    let index = 0;
    // iterate until we find a next attempt with directions
    while (!feedback && nextAttempt[index]) {
      // in some legacy data, we were not storing feedback in lastFeedback, but in directions.
      // so the second clause accounts for legacy data without lastFeedback fields.
      // this is also true for Evidence activities, at least as of 04/28/24
      feedback = nextAttempt[index].lastFeedback || nextAttempt[index].directions
      index += 1;
    }
  } else if (currAttempt[0]?.finalAttemptFeedback) {
    feedback = currAttempt[0].finalAttemptFeedback
  }

  return feedback
}
