import * as _expect from 'expect'
const expect = _expect as any as typeof _expect.default

import {
  calculatePercentage,
  generateConceptResults,
} from '../../libs/conceptResults'
import {
  currentActivity,
  expectedPayload,
  submittedResponses,
  topicOptimalData,
} from './conceptResults.data'

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
});
