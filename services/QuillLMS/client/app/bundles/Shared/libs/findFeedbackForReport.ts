export function findFeedbackForReport(attemptNum, conceptsByAttempt) {
  const currentAttempt = conceptsByAttempt[attemptNum];
  const nextAttempt = conceptsByAttempt[attemptNum + 1];

  return findFeedbackInAttempt(nextAttempt) || currentAttempt[0]?.finalAttemptFeedback;
}

function findFeedbackInAttempt(attempt) {
  if (!attempt) return null;

  const conceptResultWithLastFeedbackOrDirections = attempt.find(cr => cr.lastFeedback || cr.directions)

  if (!conceptResultWithLastFeedbackOrDirections) return null;

  return conceptResultWithLastFeedbackOrDirections.lastFeedback || conceptResultWithLastFeedbackOrDirections.directions
}
