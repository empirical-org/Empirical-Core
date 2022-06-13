import { assert } from 'chai';
import {whitespaceMatch, whitespaceChecker} from './whitespace_match'
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

describe('The whitespaceMatch function', () => {

  it('Should take a response string and find the corresponding saved response if the string matches when whitespace is removed', () => {
    const responseString:string = "Mydogtookanap.";
    const matchedResponse = whitespaceMatch(responseString, savedResponses);
    assert.equal(matchedResponse.id, savedResponses[0].id);
  });

});

describe('The whitespaceChecker', () => {

  it('Should return a partialResponse object if the string matches then whitespace is removed', () => {
    const responseString:string = "Mydogtookanap.";
    const partialResponse: PartialResponse =  {
      feedback: feedbackStrings.missingWhitespaceError,
      author: 'Whitespace Hint',
      parent_id: whitespaceMatch(responseString, savedResponses).id,
      concept_results: [
        conceptResultTemplate('5Yv4-kNHwwCO2p8HI90oqQ')
      ]
    }
    assert.equal(whitespaceChecker(responseString, savedResponses).feedback, partialResponse.feedback);
    assert.equal(whitespaceChecker(responseString, savedResponses).author, partialResponse.author);
    assert.equal(whitespaceChecker(responseString, savedResponses).parent_id, partialResponse.parent_id);
    assert.equal(whitespaceChecker(responseString, savedResponses).concept_results.length, partialResponse.concept_results.length);
  });

  it('Should return a partialResponse object if the string matches then whitespace is added', () => {
    const responseString:string = "My do g took a nap.";
    const partialResponse: PartialResponse =  {
      feedback: feedbackStrings.extraWhitespaceError,
      author: 'Whitespace Hint',
      parent_id: whitespaceMatch(responseString, savedResponses).id,
      concept_results: [
        conceptResultTemplate('5Yv4-kNHwwCO2p8HI90oqQ')
      ]
    }
    assert.equal(whitespaceChecker(responseString, savedResponses).feedback, partialResponse.feedback);
    assert.equal(whitespaceChecker(responseString, savedResponses).author, partialResponse.author);
    assert.equal(whitespaceChecker(responseString, savedResponses).parent_id, partialResponse.parent_id);
    assert.equal(whitespaceChecker(responseString, savedResponses).concept_results.length, partialResponse.concept_results.length);
  });

})
