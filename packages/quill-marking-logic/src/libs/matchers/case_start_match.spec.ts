import { assert } from 'chai';
import {caseStartMatch, caseStartChecker} from './case_start_match'
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

describe('The caseStartMatch function', () => {

  it('Should return true if the response string starts with a lowercase letter', () => {
    const responseString = "my dog took a nap.";
    assert.ok(caseStartMatch(responseString, savedResponses));
  });

  it('Should return false if the response string does not start with a lowercase letter', () => {
    const responseString = "My dog took a nap.";
    assert.notOk(caseStartMatch(responseString, savedResponses));
  });

});

describe('The caseStartChecker', () => {

  it('Should return a partialResponse object if the response string starts with a lowercase letter', () => {
    const responseString = "my dog took a nap.";
    const partialResponse =  {
      feedback: feedbackStrings.caseError,
      author: 'Capitalization Hint',
      parent_id: getTopOptimalResponse(savedResponses).id,
      concept_results: [
        conceptResultTemplate('S76ceOpAWR-5m-k47nu6KQ')
      ],
    }
    assert.equal(caseStartChecker(responseString, savedResponses).feedback, partialResponse.feedback);
    assert.equal(caseStartChecker(responseString, savedResponses).author, partialResponse.author);
    assert.equal(caseStartChecker(responseString, savedResponses).parent_id, partialResponse.parent_id);
    assert.equal(caseStartChecker(responseString, savedResponses).concept_results.length, partialResponse.concept_results.length);
  });

  it('Should return undefined if the response string does not start with a lowercase letter', () => {
    const responseString = "My dog took a nap.";
    assert.equal(caseStartChecker(responseString, savedResponses), undefined);
  });

})
