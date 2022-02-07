import { assert } from 'chai';
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
    assert.ok(requiredWordsMatch(responseString, savedResponses));
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
    assert.equal(requiredWordsChecker(responseString, savedResponses).feedback, partialResponse.feedback);
    assert.equal(requiredWordsChecker(responseString, savedResponses).author, partialResponse.author);
    assert.equal(requiredWordsChecker(responseString, savedResponses).parent_id, partialResponse.parent_id);
    assert.equal(requiredWordsChecker(responseString, savedResponses).concept_results.length, partialResponse.concept_results.length);
  });

  it('Should return undefined if the response string is not missing a required word', () => {
    const responseString = "My dog took a nap.";
    assert.equal(requiredWordsChecker(responseString, savedResponses), undefined);
  });

  it('Should return the lowercased missing word if optimal responses contain both uppercase and lowercase', () => {
    const responseString = "My dog took a.";
    assert.notEqual(requiredWordsChecker(responseString, savedResponses).feedback.indexOf('nap'), -1);
  });

})
