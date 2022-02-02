import { assert } from 'chai';
import {wordsOutOfOrderMatch, wordsOutOfOrderChecker} from './words_out_of_order_match'
import {Response, PartialResponse} from '../../interfaces'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {feedbackStrings} from '../constants/feedback_strings'

const savedResponses: Array<Response> = [
  {
    id: 1,
    text: "My dog took a nap.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 1,
    question_uid: 'questionOne'
  },
  {
    id: 2,
    text: "My cat took a nap.",
    feedback: "The animal woofs so try again!",
    optimal: false,
    count: 1,
    question_uid: 'questionOne'
  }
]

describe('The wordsOutOfOrderMatch function', () => {

  it('should match the optimal saved response when the words are rearranged', () => {
    const responseString:string = "My dog a took nap.";
    const matchedResponse = wordsOutOfOrderMatch(responseString, savedResponses);
    assert.equal(matchedResponse.id, savedResponses[0].id);
  });

  it('should match even if the swapped words are next to punctuation', () => {
    const responseString:string = "My dog took nap a.";
    const matchedResponse = wordsOutOfOrderMatch(responseString, savedResponses);
    assert.equal(matchedResponse.id, savedResponses[0].id);
  });

  it('should match even if the swapped words involve swapped capitalization', () => {
    const responseString:string = "Dog my took a nap.";
    const matchedResponse = wordsOutOfOrderMatch(responseString, savedResponses);
    assert.equal(matchedResponse.id, savedResponses[0].id);
  });

  it('Should not match a response when words are duplicated"', () => {
    const responseString:string = "My dog took a took nap.";
    const matchedResponse = wordsOutOfOrderMatch(responseString, savedResponses);
    assert.isUndefined(matchedResponse);
  });

});

describe('The wordsOutOfOrderChecker', () => {

  it('Should return a partialResponse object if the string matches when the words are re-ordered', () => {
    const responseString:string = "My dog a took nap.";
    const matchedResponse = wordsOutOfOrderChecker(responseString, savedResponses);
    const partialResponse: PartialResponse =  {
      feedback: feedbackStrings.wordsOutOfOrderError,
      author: 'Words Out of Order Hint',
      parent_id: wordsOutOfOrderMatch(responseString, savedResponses).id,
      concept_results: [
        conceptResultTemplate('5Yv4-kNHwwCO2p8HI90oqQ')
      ]
    }
    assert.equal(matchedResponse.feedback, partialResponse.feedback);
    assert.equal(matchedResponse.author, partialResponse.author);
    assert.equal(matchedResponse.parent_id, partialResponse.parent_id);
    assert.equal(matchedResponse.concept_results.length, partialResponse.concept_results.length);
  });

})
