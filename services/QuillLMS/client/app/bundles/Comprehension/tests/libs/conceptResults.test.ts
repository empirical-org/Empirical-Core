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

describe("Getting concept results from a completed Comprehension activity", () => {
  it("should determine the correct percentage", () => {
    const result = calculatePercentage(submittedResponses)
    expect(result).toEqual(0.8333333333333334)
  })

  it("should generate concept results with concept UIDs and optimal flags", () => {
    const result = generateConceptResults(currentActivity, submittedResponses)
    expect(result).toEqual(expectedPayload.concept_results)    
  })
});
