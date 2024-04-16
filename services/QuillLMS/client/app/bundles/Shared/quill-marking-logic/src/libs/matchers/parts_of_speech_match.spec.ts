import {partsOfSpeechMatch, partsOfSpeechChecker} from './parts_of_speech_match'

import {Response} from '../../interfaces'

const prompt = 'My dog took a nap.'
const savedResponses: Array<Response> = [
  {
    id: 1,
    text: "My sleepy dog took a nap.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 2,
    question_uid: 'question 1'
  },
  {
    id: 2,
    text: "My happy dog took a long nap.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 1,
    question_uid: 'question 2'
  }
]

describe('The partsOfSpeechMatch function', () => {

  it('should return a partial response object if there is a response with the same parts of speech tags as the submission', () => {
    const responseString = "My goofy dog took a short nap.";
    expect(partsOfSpeechMatch(responseString, savedResponses)).toBeTruthy()
  });

  it('should return undefined if there is no response with the same parts of speech tags as the submission', () => {
    const responseString = prompt;
    expect(partsOfSpeechMatch(responseString, savedResponses)).toBeFalsy()
  });

})

describe('The partsOfSpeechChecker function', () => {

  it('should return a partialResponse object if the response string finds a parts of speech match', () => {
    const responseString = "My goofy dog took a short nap.";
    const returnValue = partsOfSpeechChecker(responseString, savedResponses)
    expect(returnValue.author).toEqual(savedResponses[1].author);
    expect(returnValue.feedback).toEqual(savedResponses[1].feedback);
    expect(returnValue.optimal).toEqual(savedResponses[1].optimal);
    expect(returnValue.concept_results).toEqual(savedResponses[1].concept_results);
    expect(returnValue.parent_id).toEqual(savedResponses[1].id);
  });

  it('should return undefined if the response string does not match the parts of speech of any response', () => {
    const responseString = 'My grumpy dog took a nap.';
    const returnValue = partsOfSpeechChecker(responseString, savedResponses)
    expect(returnValue).toBeFalsy()
  });

})
