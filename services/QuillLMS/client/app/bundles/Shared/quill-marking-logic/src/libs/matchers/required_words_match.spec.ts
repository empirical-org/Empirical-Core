import {requiredWordsMatch, requiredWordsChecker} from './required_words_match'
import {Response, PartialResponse} from '../../interfaces'
import {conceptResultTemplate} from '../helpers/concept_result_template'

const savedResponses: Array<Response> = [
  {
    id: 1,
    text: "My dog took a Nap.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 1,
    question_uid: 'question 1'
  },
  {
    id: 2,
    text: "My dog took a nap.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 1,
    question_uid: 'question 1'
  }
]

describe('The requiredWordsMatch function', () => {

  it('Should take a response string and return a feedback object if it is missing a required word', () => {
    const responseString = "My dog took a.";
    expect(requiredWordsMatch(responseString, savedResponses)).toBeTruthy()
  });

});

describe('The requiredWordsChecker', () => {

  it('Should return a partialResponse object if the response string is missing a required word', () => {
    const responseString = "My dog took a";
    const partialResponse: PartialResponse =  {
      feedback: requiredWordsMatch(responseString, savedResponses).feedback,
      author: 'Required Words Hint',
      parent_id: 2,
      concept_results: [
        conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
      ]
    }
    expect(requiredWordsChecker(responseString, savedResponses).feedback).toEqual(partialResponse.feedback);
    expect(requiredWordsChecker(responseString, savedResponses).author).toEqual(partialResponse.author);
    expect(requiredWordsChecker(responseString, savedResponses).parent_id).toEqual(partialResponse.parent_id);
    expect(requiredWordsChecker(responseString, savedResponses).concept_results.length).toEqual(partialResponse.concept_results.length);
  });

  it('Should return undefined if the response string is not missing a required word', () => {
    const responseString = "My dog took a nap.";
    expect(requiredWordsChecker(responseString, savedResponses)).toEqual(undefined);
  });

  it('Should return the lowercased missing word if optimal responses contain both uppercase and lowercase', () => {
    const responseString = "My dog took a.";
    expect(requiredWordsChecker(responseString, savedResponses).feedback.indexOf('nap')).not.toEqual(-1)
  });

})
