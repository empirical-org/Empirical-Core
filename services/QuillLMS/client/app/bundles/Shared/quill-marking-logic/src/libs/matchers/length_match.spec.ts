import {lengthMatch, lengthChecker} from './length_match'
import {Response} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {getTopOptimalResponse} from '../sharedResponseFunctions'

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

describe('The lengthMatch function', () => {

  it('should return a too long author if the response string is longer than the prompt length plus the wordCountChange.max', () => {
    const responseString = "My happy dog took a very long nap";
    expect(lengthMatch(responseString, savedResponses, prompt, {max: 1, min: 1}).author).toEqual('Too Long Hint');
  });

  it('should return a too short author if the response string is shorter than the prompt length plus wordCountChange.max', () => {
    const responseString = prompt;
    expect(lengthMatch(responseString, savedResponses, prompt, {max: 1, min: 1}).author).toEqual('Too Short Hint');
  });

})

describe('The lengthChecker function', () => {

  it('should return a partialResponse object if the response string is longer than the prompt length plus the wordCountChange.max', () => {
    const responseString = "My happy dog took a very long nap";
    const returnValue = lengthChecker(responseString, savedResponses, prompt, {max: 1, min: 1})
    expect(returnValue.author).toEqual('Too Long Hint');
    expect(returnValue.feedback).toBeTruthy()
    expect(returnValue.optimal).toEqual(false)
    expect(returnValue.parent_id).toEqual(savedResponses[0].id)
  });

  it('should return a partialResponse object if the response string is shorter than the prompt length plus wordCountChange.max', () => {
    const responseString = prompt;
    const returnValue = lengthChecker(responseString, savedResponses, prompt, {max: 1, min: 1})
    expect(returnValue.author).toEqual('Too Short Hint');
    expect(returnValue.feedback).toBeTruthy()
    expect(returnValue.optimal).toEqual(false)
    expect(returnValue.parent_id).toEqual(savedResponses[0].id)
  });

  it('should return undefined if the response string is between prompt length plus wordCountChange.min and prompt length plus wordCountChange.max', () => {
    const responseString = 'My grumpy dog took a nap.';
    const returnValue = lengthChecker(responseString, savedResponses, prompt, {max: 1, min: 1})
    expect(returnValue).toBeFalsy()
  });

})
