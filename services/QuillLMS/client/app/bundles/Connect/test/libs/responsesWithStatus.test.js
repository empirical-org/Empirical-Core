/* global describe, it*/
import expect from 'expect';
import responsesWithStatus, { getStatusForResponse } from '../../libs/responseTools.js';
import responses, {
    algoOptimalResponse,
    algoSubOptimalResponse, optimalResponse,
    subOptimalResponse, ungradedResponse
} from '../data/sentenceFragmentResponses';

describe('Responses with status', () => {
  it('adds a status code to each response', () => {
    const respWithStat = responsesWithStatus(responses);
    let missingStatusCode = false;
    for (const key in respWithStat) {
      if (respWithStat.hasOwnProperty(key)) {
        if (respWithStat[key].statusCode === undefined) {
          missingStatusCode = true;
        }
      }
    }
    expect(missingStatusCode).toBe(false);
  });

  it('returns the original values', () => {
    const respWithStat = responsesWithStatus(responses);
    let hasInitialData = true;
    for (const key in respWithStat) {
      if (respWithStat.hasOwnProperty(key)) {
        hasInitialData = respWithStat[key].text === responses[key].text;
      }
    }
    expect(hasInitialData).toBe(true);
  });

  describe('Getting status for a response', () => {
    it('returns the correct value for an optimal response', () => {
      const status = getStatusForResponse(optimalResponse);
      expect(status).toBe(0);
    });

    it('returns the correct value for an sub optimal response', () => {
      const status = getStatusForResponse(subOptimalResponse);
      expect(status).toBe(1);
    });

    it('returns the correct value for an algorithm optimal response', () => {
      const status = getStatusForResponse(algoOptimalResponse);
      expect(status).toBe(2);
    });

    it('returns the correct value for an algorithm sub optimal response', () => {
      const status = getStatusForResponse(algoSubOptimalResponse);
      expect(status).toBe(3);
    });

    it('returns the correct value for an ungraded response', () => {
      const status = getStatusForResponse(ungradedResponse);
      expect(status).toBe(4);
    });
  });
});
