import * as _ from 'underscore'
import { assert } from 'chai';
import {caseInsensitiveMatch, caseInsensitiveChecker} from './case_insensitive_match'
import {Response} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {getTopOptimalResponse} from '../sharedResponseFunctions'

const savedResponses: Array<Response> = [
  {
    id: 1,
    text: "My dog took a nap.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 2,
    question_uid: "questionOne",
    key: "blue",
    concept_results: [{correct: true, conceptUID: 'l'}]
  },
  {
    id: 2,
    text: "My dog took another nap.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 1,
    question_uid: "questionTwo",
    parent_id: "red",
    concept_results: [{correct: true, conceptUID: 'b'}]
  }
]

describe('The caseInsensitiveMatch function', () => {

  it('Should return true if the lowercased response string matches a lowercased partial response', () => {
      const responseString = "my dog took a nap.";
      assert.ok(caseInsensitiveMatch(responseString, savedResponses));
  });

  it('Should return false if the lowercased response string does not match a lowercased partial response', () => {
      const responseString = "my cat took a nap.";
      assert.notOk(caseInsensitiveMatch(responseString, savedResponses));
  });

});

describe('The caseInsensitiveChecker', () => {

  it('Should return a partialResponse object if the lowercased response string matches a lowercased partial response', () => {
    const responseString = "my dog took a nap.";
    const partialResponse =  {
        feedback: feedbackStrings.caseError,
        author: 'Capitalization Hint',
        parent_id: caseInsensitiveMatch(responseString, savedResponses).id,
        concept_results: [
          conceptResultTemplate('S76ceOpAWR-5m-k47nu6KQ')
        ],
      }
    assert.equal(caseInsensitiveChecker(responseString, savedResponses).feedback, partialResponse.feedback);
    assert.equal(caseInsensitiveChecker(responseString, savedResponses).author, partialResponse.author);
    assert.equal(caseInsensitiveChecker(responseString, savedResponses).parent_id, partialResponse.parent_id);
    assert.equal(caseInsensitiveChecker(responseString, savedResponses).concept_results.length, partialResponse.concept_results.length);
  });

  it('Should return undefined if the lowercased response string does not match a lowercased partial response', () => {
    const responseString = "my cat took a nap.";
    assert.equal(caseInsensitiveChecker(responseString, savedResponses), undefined);
  });

  it('Should return the same concept results as the matched response if it is asked to', () => {
    const responseString = "my dog took a nap.";
    assert.ok(_.isEqual(caseInsensitiveChecker(responseString, savedResponses, true).concept_results, caseInsensitiveMatch(responseString, savedResponses).concept_results));
  });

})
