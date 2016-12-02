/* global describe, it*/
import expect from 'expect';
import { hashToCollection } from '../../app/libs/hashToCollection.js';
import SFMarkingObj, { wordLengthCount } from '../../app/libs/sentenceFragment';
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

describe('The min and max word addition matcher', () => {
  it("correctly identifies when a user doesn't add enough words", () => {
    const newResponse = markingObj.checkLengthMatch('Ran to the shop.');
    expect(newResponse.optimal).toBe(false);
    expect(newResponse.author).toBe('Too Short Hint');
  });

  it('correctly identifies when a user adds too many words', () => {
    const newResponse = markingObj.checkLengthMatch("Ran to the shop and then defaced my Mom's Harvard tote-bag.");
    expect(newResponse.optimal).toBe(false);
    expect(newResponse.author).toBe('Too Long Hint');
  });

  it('returns nothing when a user adds a suitable number of words', () => {
    const newResponse = markingObj.checkLengthMatch('I ran to the shop.');
    expect(newResponse).toBe(undefined);
  });

  it('returns the correct value when called within checkMatch', () => {
    const newResponse = markingObj.checkMatch("Ran to the shop and then defaced my Mom's Harvard tote-bag.");
    expect(newResponse.found).toBe(true);
    expect(newResponse.response.author).toBe('Too Long Hint');
    expect(newResponse.response.optimal).toBe(false);
    expect(newResponse.response.parentID).toBe('optimalResponse');
  });
});

describe('counting the number of words in a string', () => {
  it('correctly counts the number of word in a string.', () => {
    const wordLength = wordLengthCount('Ran to the shop.');
    expect(wordLength).toBe(4);
  });
});

describe('A sentence fragment object without min and max changes', () => {
  const legacyFields = Object.assign({}, fields);
  delete legacyFields.wordCountChange;
  const legacySFMarkingObj = new SFMarkingObj(legacyFields);
  it('should not fail', () => {
    const newResponse = legacySFMarkingObj.checkMatch('I ran to the shop.');
  });

  it('should not care how many words are added', () => {
    const newResponse = legacySFMarkingObj.checkMatch('I.');
    expect(newResponse.found).toBe(false);
  });

  it('should not care how many words are removed', () => {
    const newResponse = legacySFMarkingObj.checkMatch("Ran to the shop and then defaced my Mom's Harvard tote-bag.");
    expect(newResponse.found).toBe(false);
  });
});

describe('A sentence fragment object with incomplete min and max changes', () => {
  const partialLengthMarkingObj = new SFMarkingObj(fields);

  it('should still give a hint if it has a min but no max', () => {
    partialLengthMarkingObj.wordCountChange = { min: 1, };
    const newResponse = partialLengthMarkingObj.checkLengthMatch('Ran to the shop.');
    expect(newResponse.optimal).toBe(false);
    expect(newResponse.author).toBe('Too Short Hint');
  });

  it('should still give a hint if it has a max but no min', () => {
    partialLengthMarkingObj.wordCountChange = { max: 3, };
    const newResponse = markingObj.checkLengthMatch("Ran to the shop and then defaced my Mom's Harvard tote-bag.");
    expect(newResponse.optimal).toBe(false);
    expect(newResponse.author).toBe('Too Long Hint');
  });
});
