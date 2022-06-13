import { assert } from 'chai';
import {spacingAfterCommaMatch, spacingAfterCommaChecker} from './spacing_after_comma_match'
import {Response, PartialResponse} from '../../interfaces'
import {conceptResultTemplate} from '../helpers/concept_result_template'

const savedResponses: Array<Response> = [
  {
    id: 1,
    text: "My dog took a nap.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 1,
    question_uid: 'question 1'
  }
]

describe('The spacingAfterCommaMatch function', () => {

  it('Should take a response string and return true if there is no space after a comma', () => {
    const responseString = "My dog took a nap,did yours?";
    const matchedResponse = spacingAfterCommaMatch(responseString);
    assert.isOk(matchedResponse);
  });

  it('Should take a response string and return false if the comma is surrounded by numbers', () => {
    const responseString = "My dog took a 2,000 year nap, did yours?";
    const matchedResponse = spacingAfterCommaMatch(responseString);
    assert.notOk(matchedResponse);
  });

  it('Should take a response string and return false if the comma is followed by a quotation mark', () => {
    const responseString = 'Get those blankets off of me," yelled my brother.'
    const matchedResponse = spacingAfterCommaMatch(responseString);
    assert.notOk(matchedResponse);
  });

});

describe('The spacingAfterCommaChecker', () => {

  it('Should return a partialResponse object if there is no space after a comma', () => {
    const responseString = "My dog took a nap,did yours?";
    const partialResponse: PartialResponse =  {
      feedback: 'Revise your work. Always put a space after a comma.',
      author: 'Spacing After Comma Hint',
      parent_id: 1,
      concept_results: [
        conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
      ]
    }
    assert.equal(spacingAfterCommaChecker(responseString, savedResponses).feedback, partialResponse.feedback);
    assert.equal(spacingAfterCommaChecker(responseString, savedResponses).author, partialResponse.author);
    assert.equal(spacingAfterCommaChecker(responseString, savedResponses).parent_id, partialResponse.parent_id);
    assert.equal(spacingAfterCommaChecker(responseString, savedResponses).concept_results.length, partialResponse.concept_results.length);
  });

  it('Should return undefined if there is a space after a comma', () => {
    const responseString = "My dog took a nap, did yours?";
    assert.equal(spacingAfterCommaChecker(responseString, savedResponses), undefined);
  });

  it('Should return undefined if the comma is surrounded by numbers', () => {
    const responseString = "My dog took a 2,000 year nap, did yours?";
    assert.equal(spacingAfterCommaChecker(responseString, savedResponses), undefined);
  });

})
