import { assert } from 'chai';

import {punctuationEndMatch, punctuationEndChecker } from './punctuation_end_match'

import {Response,PartialResponse} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'

describe('The punctuationEndMatch function', () => {

  it('Should take a response string and find top optimal response if the response string ends with a letter', () => {
    const responseString = "My dog took a nap";
    const savedResponses: Array<Response> = [
      {
        id: 1,
        text: "My dog took a nap.",
        feedback: "Good job, that's a sentence!",
        optimal: true,
        count: 2,
        question_uid: "questionOne"
      },
      {
        id: 2,
        text: "My dog took another nap.",
        feedback: "Good job, that's a sentence!",
        optimal: true,
        count: 1,
        question_uid: "questionTwo"
      }
    ]
    assert.ok(punctuationEndMatch(responseString, savedResponses));
  });

  it('Should take a response string and find top optimal response if the response string ends with a letter', () => {
    const responseString = "My dog took a nap";
    const savedResponses: Array<Response> = [
      {
        id: 1,
        text: "My dog took a nap.",
        feedback: "Good job, that's a sentence!",
        optimal: true,
        count: 2,
        question_uid: "questionOne"
      },
      {
        id: 2,
        text: "My dog took another nap.",
        feedback: "Good job, that's a sentence!",
        optimal: true,
        count: 1,
        question_uid: "questionTwo"
      }
    ]
    const partialResponse: PartialResponse =  {
      feedback: feedbackStrings.punctuationEndError,
      author: 'Punctuation End Hint',
      parent_id: punctuationEndChecker(responseString, savedResponses).id,
      concept_results: [
        conceptResultTemplate('68mWURj5PUdSICATQay8uA')
      ]
    }
    assert.equal(punctuationEndChecker(responseString, savedResponses).feedback, partialResponse.feedback);
    assert.equal(punctuationEndChecker(responseString, savedResponses).author, partialResponse.author);
    assert.equal(punctuationEndChecker(responseString, savedResponses).concept_results.length, partialResponse.concept_results.length);
  });

});
