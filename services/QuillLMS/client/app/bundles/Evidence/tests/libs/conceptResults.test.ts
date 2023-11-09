import * as _expect from 'expect';
const expect = _expect as any as typeof _expect.default

import {
  generateConceptResults
} from '../../libs/conceptResults';
import {
  currentActivity,
  expectedPayload,
  submittedResponses,
  topicOptimalData,
} from './conceptResults.data';

describe("Getting concept results from a completed Evidence activity", () => {
  it("should generate concept results with concept UIDs and optimal flags", () => {
    const result = generateConceptResults(currentActivity, submittedResponses, topicOptimalData)
    expect(result).toEqual(expectedPayload.concept_results)
  })

  it("should generate one concept result per response if there are no topic-optimal non-optimal responses", () => {
    // We will simulate this by providing no topicOptimalData when calculating concept results
    const allResponses = submittedResponses["1"].concat(submittedResponses["2"]).concat(submittedResponses["3"])

    const result = generateConceptResults(currentActivity, submittedResponses)

    expect(result.length).toEqual(allResponses.length)
  })

  it("should generate topic-optimal ConceptResults when a non-optimal post-autoML feedback is received", () => {
    const result = generateConceptResults(currentActivity, submittedResponses, topicOptimalData)
    expect(result.filter(conceptResult => (
      conceptResult.concept_uid == topicOptimalData.concept_uids[3] && 
        conceptResult.metadata.correct == 1
    )).length).toEqual(1)
  })

  it("should score 1.0 if any responses are optimal", () => {
    const result = generateConceptResults(currentActivity, submittedResponses, topicOptimalData)

    expect(result[0].metadata.questionScore).toEqual(1.0)
  })

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
    }
    const result = generateConceptResults(currentActivity, noOptimalResponses, topicOptimalData)

    expect(result[0].metadata.questionScore).toEqual(0.0)
  })
});
