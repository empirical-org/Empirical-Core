/* global describe, it*/
import expect from 'expect';
import SFMarkingObj from '../../app/libs/sentenceFragment';

describe('The Sentence Fragment Marking Object', () => {
  const responses = [
    {
      text: 'I ran to the shop.',
      optimal: true,
    },
    {
      text: 'I walked to the shop.',
    }
  ];
  const questionUID = 'mockID';

  const fields = {
    prompt: 'Ran to the shop.',
    wordCountChange: { min: 1, max: 2, },
    responses,
    questionUID,
  };

  const markingObj = new SFMarkingObj(fields);

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
    expect(responseLength).toBe(1);
  });
});
