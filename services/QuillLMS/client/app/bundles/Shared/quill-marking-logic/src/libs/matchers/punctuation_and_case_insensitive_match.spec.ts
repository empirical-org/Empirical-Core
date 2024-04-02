import { assert } from 'chai';
import * as _ from 'underscore'
import {punctuationAndCaseInsensitiveMatch, punctuationAndCaseInsensitiveChecker} from './punctuation_and_case_insensitive_match'
import {Response, PartialResponse} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'

const savedResponses: Array<Response> = [
  {
    id: 1,
    text: "My dog took a nap.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 1,
    question_uid: 'question 1',
    concept_results: [{correct: true, conceptUID: 'l'}]
  }
]

describe('The punctuationAndCaseInsensitiveMatch function', () => {

  it('Should take a response string and find the corresponding saved response if the string matches exactly when punctuation is removed and both are downcased', () => {
    const responseString = "my dog took a nap";
    const matchedResponse: Response = punctuationAndCaseInsensitiveMatch(responseString, savedResponses);
    assert.equal(matchedResponse.id, savedResponses[0].id);
  });

});

describe('The punctuationAndCaseInsensitiveChecker', () => {

  it('Should return a partialResponse object if the lowercased response string matches a lowercased partial response', () => {
    const responseString = "my dog took a nap.";
    const partialResponse: PartialResponse =  {
      feedback: feedbackStrings.punctuationAndCaseError,
      author: 'Punctuation and Case Hint',
      parent_id: punctuationAndCaseInsensitiveMatch(responseString, savedResponses).id,
      concept_results: [
        conceptResultTemplate('66upe3S5uvqxuHoHOt4PcQ'),
        conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
      ]
    }
    assert.equal(punctuationAndCaseInsensitiveChecker(responseString, savedResponses).feedback, partialResponse.feedback);
    assert.equal(punctuationAndCaseInsensitiveChecker(responseString, savedResponses).author, partialResponse.author);
    assert.equal(punctuationAndCaseInsensitiveChecker(responseString, savedResponses).parent_id, partialResponse.parent_id);
    assert.equal(punctuationAndCaseInsensitiveChecker(responseString, savedResponses).concept_results.length, partialResponse.concept_results.length);
  });

  it('Should return undefined if the lowercased response string does not match a lowercased partial response', () => {
    const responseString = "my cat took a nap.";
    assert.equal(punctuationAndCaseInsensitiveChecker(responseString, savedResponses), undefined);
  });

  it('Should return the same concept results as the matched response if it is asked to', () => {
    const responseString = "my dog took a nap.";
    assert.ok(_.isEqual(punctuationAndCaseInsensitiveChecker(responseString, savedResponses, true).concept_results, punctuationAndCaseInsensitiveMatch(responseString, savedResponses).concept_results));
  });

})
