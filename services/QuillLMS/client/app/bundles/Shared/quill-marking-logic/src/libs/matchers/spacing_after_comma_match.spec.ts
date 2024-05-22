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
    expect(matchedResponse).toBeTruthy()
  });

  it('Should take a response string and return false if the comma is surrounded by numbers', () => {
    const responseString = "My dog took a 2,000 year nap, did yours?";
    const matchedResponse = spacingAfterCommaMatch(responseString);
    expect(matchedResponse).toBeFalsy()
  });

  it('Should take a response string and return false if the comma is followed by a quotation mark', () => {
    const responseString = 'Get those blankets off of me," yelled my brother.'
    const matchedResponse = spacingAfterCommaMatch(responseString);
    expect(matchedResponse).toBeFalsy()
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
    expect(spacingAfterCommaChecker(responseString, savedResponses).feedback).toEqual(partialResponse.feedback);
    expect(spacingAfterCommaChecker(responseString, savedResponses).author).toEqual(partialResponse.author);
    expect(spacingAfterCommaChecker(responseString, savedResponses).parent_id).toEqual(partialResponse.parent_id);
    expect(spacingAfterCommaChecker(responseString, savedResponses).concept_results.length).toEqual(partialResponse.concept_results.length);
  });

  it('Should return undefined if there is a space after a comma', () => {
    const responseString = "My dog took a nap, did yours?";
    expect(spacingAfterCommaChecker(responseString, savedResponses)).toEqual(undefined);
  });

  it('Should return undefined if the comma is surrounded by numbers', () => {
    const responseString = "My dog took a 2,000 year nap, did yours?";
    expect(spacingAfterCommaChecker(responseString, savedResponses)).toEqual(undefined);
  });

})
