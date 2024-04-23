import {maxLengthMatch, maxLengthChecker} from './max_length_match'
import {Response} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {getTopOptimalResponse} from '../sharedResponseFunctions'

describe('The maxLengthMatch function', () => {

  it('Should return true if the response string is at least two words longer than any of them and there are at least two optimal responses', () => {
    const responseString = "My goofy dog took a very long nap.";
    const savedResponses: Array<Response> = [
      {
        id: 1,
        text: "My sleepy dog took a nap.",
        feedback: "Good job, that's a sentence!",
        optimal: true,
        count: 1,
        question_uid: 'question 1'
      },
      {
        id: 2,
        text: "My dog took a nap.",
        feedback: "Good job, that's a sentence!",
        optimal: true,
        count: 1,
        question_uid: 'question 2'
      }
    ]
    expect(maxLengthMatch(responseString, savedResponses)).toBeTruthy()
  });

  it('Should take a response string and return false if it is longer than the longest optimal response by one word', () => {
    const responseString = "My goofy dog took a very long nap.";
    const savedResponses: Array<Response> = [
      {
        id: 1,
        text: "My sleepy dog took a nap.",
        feedback: "Good job, that's a sentence!",
        optimal: true,
        count: 1,
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
    expect(maxLengthMatch(responseString, savedResponses)).toBeFalsy()
  });

  it('Should take a response string and return false if there are not at least two optimal responses', () => {
    const responseString = "My goofy dog took a very long nap.";
    const savedResponses: Array<Response> = [
      {
        id: 1,
        text: "My sleepy dog took a nap.",
        feedback: "Good job, that's a sentence!",
        optimal: true,
        count: 1,
        question_uid: 'question 1'
      },
      {
        id: 2,
        text: "My dog took a nap.",
        feedback: "Good job, that's a sentence!",
        optimal: false,
        count: 1,
        question_uid: 'question 2'
      }
    ]
    expect(maxLengthMatch(responseString, savedResponses)).toBeFalsy()
  });

});

describe('The maxLengthChecker', () => {

  it('Should return a partial response if response string is at least two words longer than any of them and there are at least two optimal responses', () => {
    const responseString = "My goofy dog took a very long nap.";
    const savedResponses: Array<Response> = [
      {
        id: 1,
        text: "My sleepy dog took a nap.",
        feedback: "Good job, that's a sentence!",
        optimal: true,
        count: 1,
        question_uid: 'question 1',
        key: "1"
      },
      {
        id: 2,
        text: "My dog took a nap.",
        feedback: "Good job, that's a sentence!",
        optimal: true,
        count: 1,
        question_uid: 'question 2',
        key: "2"
      }
    ]
    const longestOptimalResponse = savedResponses.sort(r => r.text.length)[0]
    const partialResponse =  {
      feedback: feedbackStrings.maxLengthError,
      author: 'Not Concise Hint',
      parent_id: longestOptimalResponse.key,
      concept_results: [
        conceptResultTemplate('QYHg1tpDghy5AHWpsIodAg')
      ]
    }
    expect(maxLengthChecker(responseString, savedResponses).feedback).toEqual(partialResponse.feedback);
    expect(maxLengthChecker(responseString, savedResponses).author).toEqual(partialResponse.author);
    expect(maxLengthChecker(responseString, savedResponses).parent_id).toEqual(partialResponse.parent_id);
    expect(maxLengthChecker(responseString, savedResponses).concept_results.length).toEqual(partialResponse.concept_results.length);
  });

})
