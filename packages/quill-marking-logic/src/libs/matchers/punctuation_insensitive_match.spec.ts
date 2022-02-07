import * as _ from 'underscore'
import { assert } from 'chai';
import {punctuationInsensitiveMatch, punctuationInsensitiveChecker} from './punctuation_insensitive_match'
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
    question_uid: "questionOne",
    concept_results: [{correct: true, conceptUID: 'l'}]
  }
]

describe('The punctuationInsensitiveMatch function', () => {

  it('Should take a response string and find the corresponding saved response if the string matches exactly when punctuation is removed', () => {
    const responseString = "My dog took a nap";
    const matchedResponse: Response = punctuationInsensitiveMatch(responseString, savedResponses);
    assert.equal(matchedResponse.id, savedResponses[0].id);
  });

});

describe('The punctuationInsensitiveChecker', () => {

  it('Should return a partialResponse object if the lowercased response string matches a lowercased partial response', () => {
    const responseString = "My dog took a nap";
    const partialResponse: PartialResponse =  {
      feedback: feedbackStrings.punctuationError,
      author: 'Punctuation Hint',
      parent_id: punctuationInsensitiveMatch(responseString, savedResponses).id,
      concept_results: [
        conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
      ]
    }
    assert.equal(punctuationInsensitiveChecker(responseString, savedResponses).feedback, partialResponse.feedback);
    assert.equal(punctuationInsensitiveChecker(responseString, savedResponses).author, partialResponse.author);
    assert.equal(punctuationInsensitiveChecker(responseString, savedResponses).parent_id, partialResponse.parent_id);
    assert.equal(punctuationInsensitiveChecker(responseString, savedResponses).concept_results.length, partialResponse.concept_results.length);
  });

  it('Should return undefined if the lowercased response string does not match a lowercased partial response', () => {
    const responseString = "my cat took a nap.";
    assert.equal(punctuationInsensitiveChecker(responseString, savedResponses), undefined);
  });

  it('Should return the same concept results as the matched response if it is asked to', () => {
    const responseString = "My dog took a nap.";
    assert.ok(_.isEqual(punctuationInsensitiveChecker(responseString, savedResponses, true).concept_results, punctuationInsensitiveMatch(responseString, savedResponses).concept_results));
  });

})
