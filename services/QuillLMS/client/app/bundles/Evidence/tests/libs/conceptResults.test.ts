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
} from './conceptResults.data'

describe("Getting concept results from a completed Evidence activity", () => {
  it("should generate concept results with concept UIDs and optimal flags", () => {
    const result = generateConceptResults(currentActivity, submittedResponses)
    expect(result).toEqual(expectedPayload.concept_results)
  })

  it("should generate topic-optimal ConceptResults when a non-optimal post-autoML feedback is received", () => {
    delete submittedResponses["1"]
    delete submittedResponses["2"]
    submittedResponses["3"].splice(1)
    const result = generateConceptResults(currentActivity, submittedResponses)
    expect(result.filter(conceptResult => (
      conceptResult.concept_uid == "placeholder" &&
        conceptResult.metadata.correct == 0
    )).length).toEqual(1)
    expect(result.filter(conceptResult => (
      conceptResult.concept_uid == "IBdOFpAWi42LgfXvcz0scQ" && 
        conceptResult.metadata.correct == 1
    )).length).toEqual(1)
  })
});
