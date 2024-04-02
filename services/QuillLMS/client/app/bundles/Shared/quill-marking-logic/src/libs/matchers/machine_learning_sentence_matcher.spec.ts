import {assert} from 'chai'
import {machineLearningSentenceMatch, machineLearningSentenceChecker} from './machine_learning_sentence_match'
import {Response} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {getTopOptimalResponse} from '../sharedResponseFunctions'

const prompt = 'My dog took a nap.'
const savedResponses: Array<Response> = [
  {
    id: 1,
    text: "My sleepy dog took a nap.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 2,
    question_uid: 'question 1'
  },
  {
    id: 2,
    text: "My happy dog took a long nap.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 1,
    question_uid: 'question 2'
  }
]

function returnsTrue() {
  return Promise.resolve({
    human_readable: "You made an error.",
    match: true,
    primary_error: "Boop",
  })
}

function returnsFalse() {
  return Promise.resolve({
    human_readable: undefined,
    match: undefined,
    primary_error: undefined,
  })
}

describe('The machineLearningSentenceMatchChecker function', () => {

  it('should return a partialResponse object if the matcher returns a response', async () => {
    const responseString = "My goofy dog took a short nap.";
    const returnValue = await machineLearningSentenceChecker(responseString, savedResponses, 'http://localhost:3100', returnsTrue)
    assert.equal(returnValue.author, 'Boop');
    assert.equal(returnValue.feedback, "You made an error.");
    assert.equal(returnValue.optimal, false);
    assert.equal(returnValue.parent_id, getTopOptimalResponse(savedResponses).id);

  });

  it('should return a partialResponse object if the matcher returns false', async () => {
    const responseString = 'My grumpy dog took a nap.';
    const returnValue = await machineLearningSentenceChecker(responseString, savedResponses, 'http://localhost:3100', returnsFalse)
    assert.equal(returnValue, undefined);
  });

});
