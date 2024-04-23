import {spacingBeforePunctuationMatch, spacingBeforePunctuationChecker} from './spacing_before_punctuation_match'
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

describe('The spacingBeforePunctuationMatch function', () => {

  it('Should take a response string and return true if there is no space before punctuation', () => {
    const responseString = "My dog took a nap, did yours ? ";
    const matchedResponse = spacingBeforePunctuationMatch(responseString);
    expect(matchedResponse).toBeTruthy()
  });

});

describe('The spacingBeforePunctuationChecker', () => {

  it('Should return a partialResponse object if the response string is missing spacing before punctuation', () => {
    const responseString = "My dog took a nap, did yours ?";
    const partialResponse: PartialResponse =  {
      feedback: spacingBeforePunctuationMatch(responseString).feedback,
      author: 'Punctuation Hint',
      parent_id: 1,
      concept_results: [
        conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
      ]
    }
    expect(spacingBeforePunctuationChecker(responseString, savedResponses).feedback).toEqual(partialResponse.feedback);
    expect(spacingBeforePunctuationChecker(responseString, savedResponses).author).toEqual(partialResponse.author);
    expect(spacingBeforePunctuationChecker(responseString, savedResponses).parent_id).toEqual(partialResponse.parent_id);
    expect(spacingBeforePunctuationChecker(responseString, savedResponses).concept_results.length).toEqual(partialResponse.concept_results.length);
  });

  it('Should return undefined if the response string is not missing space before punctuation', () => {
    const responseString = "My dog took a nap.";
    expect(spacingBeforePunctuationChecker(responseString, savedResponses)).toEqual(undefined);
  });

})
