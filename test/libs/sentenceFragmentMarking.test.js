/* global describe, it*/
import expect from 'expect';
import SFMarkingObj from '../../app/libs/sentenceFragment';
import responses, {
  optimalResponse
} from '../data/sentenceFragmentResponses';

const questionUID = 'mockID';

const fields = {
  prompt: 'Ran to the shop.',
  wordCountChange: { min: 1, max: 2, },
  responses,
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
    expect(newResponse.exactMatch).toBe(true);
  });

  it('can check for a POS match', () => {
    const newResponse = markingObj.checkMatch('I crawled to the shop.');
    expect(newResponse.posMatch).toBe(true);
  });
});
