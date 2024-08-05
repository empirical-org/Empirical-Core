import {
  currentActivity,
  expectedPayload,
  submittedResponses,
  topicOptimalData,
} from './conceptResults.data';

import {
  generateConceptResults,
  generatePercentageScore
} from '../../libs/conceptResults';

describe("Getting concept results from a completed Evidence activity", () => {
  it("should generate concept results with concept UIDs and optimal flags", () => {
    const result = generateConceptResults(currentActivity, submittedResponses, topicOptimalData);
    expect(result).toEqual(expectedPayload.concept_results);
  });

  it("should generate one concept result per response if there are no topic-optimal non-optimal responses", () => {
    // We will simulate this by providing no topicOptimalData when calculating concept results
    const allResponses = submittedResponses["1"].concat(submittedResponses["2"]).concat(submittedResponses["3"]);

    const result = generateConceptResults(currentActivity, submittedResponses, null);

    expect(result.length).toEqual(allResponses.length);
  });

  it("should generate topic-optimal ConceptResults when a non-optimal post-autoML feedback is received", () => {
    const result = generateConceptResults(currentActivity, submittedResponses, topicOptimalData);
    expect(result.filter(conceptResult => (
      conceptResult.concept_uid === topicOptimalData.concept_uids[3] &&
        conceptResult.metadata.correct === 1
    )).length).toEqual(1);
  });

  it("should score 1.0 if any responses are optimal", () => {
    const result = generateConceptResults(currentActivity, submittedResponses, topicOptimalData);

    expect(result[0].metadata.questionScore).toEqual(1.0);
  });

  it("should score 0.0 if no responses are optimal", () => {
    const noOptimalResponses = {
      "1": [
        {
          "concept_uid": "placeholder",
          "entry":"Type an answer because some response may be provided.",
          "feedback":"Thank you for your response.",
          "feedback_type":"autoML",
          "optimal":false,
          "highlight":null
        }
      ]
    };
    const result = generateConceptResults(currentActivity, noOptimalResponses, topicOptimalData);

    expect(result[0].metadata.questionScore).toEqual(0.0);
  });
});

describe('generatePercentageScore', () => {
  it('should calculate the percentage score correctly', () => {
    const conceptResults = [
      { metadata: { questionNumber: 1, correct: 1 } },
      { metadata: { questionNumber: 1, correct: 0 } },
      { metadata: { questionNumber: 2, correct: 1 } },
      { metadata: { questionNumber: 3, correct: 0 } }
    ];

    const percentageScore = generatePercentageScore(conceptResults);

    expect(percentageScore).toBe(0.67); // 2 out of 3 questions are correct
  });

  it('should return null if there are no questions', () => {
    const conceptResults = [];

    const percentageScore = generatePercentageScore(conceptResults);

    expect(percentageScore).toBe(null);
  });

  it('should handle all questions being incorrect', () => {
    const conceptResults = [
      { metadata: { questionNumber: 1, correct: 0 } },
      { metadata: { questionNumber: 2, correct: 0 } },
      { metadata: { questionNumber: 3, correct: 0 } }
    ];

    const percentageScore = generatePercentageScore(conceptResults);

    expect(percentageScore).toBe(0);
  });

  it('should handle all questions being correct', () => {
    const conceptResults = [
      { metadata: { questionNumber: 1, correct: 1 } },
      { metadata: { questionNumber: 2, correct: 1 } },
      { metadata: { questionNumber: 3, correct: 1 } }
    ];

    const percentageScore = generatePercentageScore(conceptResults);

    expect(percentageScore).toBe(1);
  });
});
