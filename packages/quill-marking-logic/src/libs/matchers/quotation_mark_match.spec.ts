import { assert } from 'chai';

import { quotationMarkChecker, quotationMarkMatch } from './quotation_mark_match';

import {Response,PartialResponse} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'

describe('The quotationMarkMatch function', () => {

  it('Should take a response string and return true if response does not contain two adjacent single quotes', () => {
    const responseString = "There are adjacent single quotes in \'\' this string.";
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
    assert.ok(quotationMarkMatch(responseString, savedResponses));
  });

  it('Should take a response string and return false if response does not contain two adjacent single quotes', () => {
    const responseString = "There are only double \" \" quotes in this string.";
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
    assert.notOk(quotationMarkMatch(responseString, savedResponses));
  });

  it('Should take a response string and find top optimal response if the response string contains two adjacent single quotes', () => {
    const responseString = "There are two adjacent single quotes \'\' in this string.";
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
      feedback: feedbackStrings.quotationMarkError,
      author: 'Quotation Mark Hint',
      parent_id: quotationMarkChecker(responseString, savedResponses).id,
      concept_results: [
        conceptResultTemplate('TWgxAwCxRjDLPzpZWYmGrw')
      ]
    }
    assert.equal(quotationMarkChecker(responseString, savedResponses).feedback, partialResponse.feedback);
    assert.equal(quotationMarkChecker(responseString, savedResponses).author, partialResponse.author);
    assert.equal(quotationMarkChecker(responseString, savedResponses).concept_results.length, partialResponse.concept_results.length);
  });

});
