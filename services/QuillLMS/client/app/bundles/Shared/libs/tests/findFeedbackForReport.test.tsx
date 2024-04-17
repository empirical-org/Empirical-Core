import * as React from 'react'

import { findFeedbackForReport } from '../findFeedbackForReport'

describe('findFeedbackForReport', () => {

  it('returns false if no next attempt exists and no final attempt feedback', () => {
    const attemptNum = 0;
    const conceptsByAttempt = [
      [{}]
    ];
    expect(findFeedbackForReport(attemptNum, conceptsByAttempt)).toBeFalsy();
  });

  it('returns finalAttemptFeedback if present on the current attempt', () => {
    const attemptNum = 0;
    const conceptsByAttempt = [
      [{ finalAttemptFeedback: "Well done on your final try!" }]
    ];
    expect(findFeedbackForReport(attemptNum, conceptsByAttempt)).toBe("Well done on your final try!");
  });

  it('returns feedback from the next attempt if present', () => {
    const attemptNum = 0;
    const conceptsByAttempt = [
      [{}],
      [{ lastFeedback: "Try to improve your form." }]
    ];
    expect(findFeedbackForReport(attemptNum, conceptsByAttempt)).toBe("Try to improve your form.");
  });

  it('returns directions from the next attempt if lastFeedback is not present', () => {
    const attemptNum = 0;
    const conceptsByAttempt = [
      [{}],
      [{ directions: "Review the previous steps." }]
    ];
    expect(findFeedbackForReport(attemptNum, conceptsByAttempt)).toBe("Review the previous steps.");
  });

  it('continues searching through next attempt until feedback is found', () => {
    const attemptNum = 0;
    const conceptsByAttempt = [
      [{}],
      [{}, {}, { lastFeedback: "Good job on this step!" }]
    ];
    expect(findFeedbackForReport(attemptNum, conceptsByAttempt)).toBe("Good job on this step!");
  });

  it('returns false if no feedback or directions are found in the next attempt', () => {
    const attemptNum = 0;
    const conceptsByAttempt = [
      [{}],
      [{}, {}]
    ];
    expect(findFeedbackForReport(attemptNum, conceptsByAttempt)).toBeFalsy();
  });
});
