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
    question_uid: "questionOne"
  }
]

describe('The wordsOutOfOrderMatch function', () => {

  it('Determine if the provided response matches the optimal saved response when the words are rearranged', () => {
      const responseString:string = "My dog a took nap.";
      const matchedResponse = wordsOutOfOrderMatch(responseString, savedResponses);
      assert.equal(matchedResponse.id, savedResponses[0].id);
  });

});

describe('The wordsOutOfOrderChecker', () => {

  it('Should return a partialResponse object if the string matches when the words are re-ordered', () => {
    const responseString:string = "My dog a took nap.";
    const partialResponse: PartialResponse =  {
        feedback: feedbackStrings.wordsOutOfOrderError,
        author: 'Words Out of Order Hint',
        parent_id: wordsOutOfOrderMatch(responseString, savedResponses).id,
        concept_results: [
          conceptResultTemplate('5Yv4-kNHwwCO2p8HI90oqQ')
        ]
      }
    assert.equal(wordsOutOfOrderChecker(responseString, savedResponses).feedback, partialResponse.feedback);
    assert.equal(wordsOutOfOrderChecker(responseString, savedResponses).author, partialResponse.author);
    assert.equal(wordsOutOfOrderChecker(responseString, savedResponses).parent_id, partialResponse.parent_id);
    assert.equal(wordsOutOfOrderChecker(responseString, savedResponses).concept_results.length, partialResponse.concept_results.length);
  });

})
