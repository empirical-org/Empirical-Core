/*
  To prevent a specific activity classification from being used to calculate
  aggregate scores, the activity classification ID should be added to the
  array below.
*/

export const nonRelevantActivityClassificationIds = [
  4, // Diagnostic
  6, // Lessons
  9, // Evidence
];

export default function shouldCountForScoring(activityClassificationID) {
  /*
    This function acts as a single source of truth for determining which
    activity classifications should count when calculating aggregate scores.

    (For example, the Diagnostic activity classification will always return
    activity sessions with a perfect score, so it doesn't make sense to use
    these when calculating a student's average percentage.)
  */
  return !nonRelevantActivityClassificationIds.includes(Number(activityClassificationID));
}
