import {minLengthMatch, minLengthChecker} from './min_length_match'

import {Response} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {getTopOptimalResponse} from '../sharedResponseFunctions'

describe('The minLengthMatch function', () => {

  it('should return true if the response string four words or more shorter than any of the optimal responses', () => {
    const responseString = "My dog.";
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
    expect(minLengthMatch(responseString, savedResponses)).toBeTruthy()
  });

  it('should return false if the response string is only shorter than the optimal response by two words', () => {
    const responseString = "My sleepy dog took.";
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
    expect(minLengthMatch(responseString, savedResponses)).toEqual(false)
  });

  it('Should take a response string and return undefined if it is shorter than the shortest optimal response by three words or less', () => {
    const responseString = "My dog took a nap.";
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
    expect(minLengthMatch(responseString, savedResponses)).toBeFalsy()
  });

});

describe('The minLengthChecker', () => {

  const responseString = "My dog";
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

  it('Should return a partial response if response string is at least four words shorter than any of them', () => {
    const shortestOptimalResponse = savedResponses.sort(r => r.text.length)[0]
    const partialResponse =  {
      feedback: feedbackStrings.minLengthError,
      author: 'Missing Details Hint',
      parent_id: shortestOptimalResponse.key,
      concept_results: [
        conceptResultTemplate('N5VXCdTAs91gP46gATuvPQ')
      ]
    }
    expect(minLengthChecker(responseString, savedResponses).feedback).toEqual(partialResponse.feedback);
    expect(minLengthChecker(responseString, savedResponses).author).toEqual(partialResponse.author);
    expect(minLengthChecker(responseString, savedResponses).parent_id).toEqual(partialResponse.parent_id);
    expect(minLengthChecker(responseString, savedResponses).concept_results.length).toEqual(partialResponse.concept_results.length);
  });

  it('Should not return a partial response if response string is only two words shorter than the optimal response', () => {
    const responseString = 'My happy dog took a'
    expect(minLengthChecker(responseString, savedResponses)).toBeFalsy()
  });

  it('Should not return any concept results if it is asked to', () => {
    expect(minLengthChecker(responseString, savedResponses, true).concept_results).toBeFalsy()
  });

})
