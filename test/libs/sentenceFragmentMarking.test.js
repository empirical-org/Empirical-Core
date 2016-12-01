/* global describe, it*/
import expect from 'expect';
import { hashToCollection } from '../../app/libs/hashToCollection.js';
import SFMarkingObj from '../../app/libs/sentenceFragment';
import responses, {
  optimalResponse
} from '../data/sentenceFragmentResponses';

const questionUID = 'mockID';

const fields = {
  prompt: 'Ran to the shop.',
  wordCountChange: { min: 1, max: 2, },
  responses: hashToCollection(responses),
  questionUID,
};

const markingObj = new SFMarkingObj(fields);

describe('The Sentence Fragment Marking Object', () => {
  it('correctly applies passed data to the object', () => {
    let objectsMatch = true;
    for (const key in markingObj) {
      if (markingObj[key] !== fields[key]) {
        objectsMatch = false;
        break;
      }
    }
    expect(objectsMatch).toBe(true);
  });

  it('correctly retrieves graded responses', () => {
    const responseLength = markingObj.getGradedResponses().length;
    expect(responseLength).toBe(2);
  });
});

describe('The Sentence Fragment Marking Logic', () => {
  it('can check for an exact match', () => {
    const newResponse = markingObj.checkMatch(optimalResponse.text);
    expect(newResponse.found).toBe(true);
    expect(newResponse.response.parentID).toBe(undefined);
  });

  it('can check for a POS match on optimal responses', () => {
    const newResponse = markingObj.checkMatch('I crawled to the shop.');
    expect(newResponse.found).toBe(true);
    expect(newResponse.response.author).toBe('Parts of Speech');
    expect(newResponse.response.optimal).toBe(true);
    expect(newResponse.response.parentID).toBe('optimalResponse');
  });

  it('can check for a POS match on suboptimal responses', () => {
    const newResponse = markingObj.checkMatch('Ran to the shop slowly.');
    expect(newResponse.found).toBe(true);
    expect(newResponse.response.author).toBe('Parts of Speech');
    expect(newResponse.response.optimal).toBe(false);
    expect(newResponse.response.parentID).toBe('subOptimalResponse');
  });

  it('cannot return a POS match on ungraded responses', () => {
    const newResponse = markingObj.checkMatch('I piggybacked to the store');
    expect(newResponse.found).toBe(false);
    expect(newResponse.response.author).toBe(undefined);
    expect(newResponse.response.optimal).toBe(undefined);
    expect(newResponse.response.parentID).toBe(undefined);
  });
});
