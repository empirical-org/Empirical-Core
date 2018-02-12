const assert = require('chai').use(require('chai-as-promised')).assert
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
  return Promise.resolve(true)
}

function returnsFalse() {
  return Promise.resolve(false)
}

describe('The machineLearningSentenceMatchChecker function', () => {

    it('should return a partialResponse object if the matcher returns true', async () => {
      const responseString = "My goofy dog took a short nap.";
        const returnValue = await machineLearningSentenceChecker(responseString, savedResponses, 'http://localhost:3100', returnsTrue)
        assert.equal(returnValue.author, 'Parts of Speech');
        assert.equal(returnValue.feedback, "That's a strong sentence!");
        assert.equal(returnValue.optimal, true);
        assert.equal(returnValue.concept_results, getTopOptimalResponse(savedResponses).concept_results);
        assert.equal(returnValue.parent_id, getTopOptimalResponse(savedResponses).id);

    });

    it('should return a partialResponse object if the matcher returns false', async () => {
        const responseString = 'My grumpy dog took a nap.';
        const returnValue = await machineLearningSentenceChecker(responseString, savedResponses, 'http://localhost:3100', returnsFalse)
        assert.equal(returnValue.author, 'Parts of Speech');
        assert.equal(returnValue.feedback, "Revise your work. A complete sentence must have an action word and a person or thing doing the action.");
        assert.equal(returnValue.optimal, false);
        assert.equal(returnValue.concept_results, getTopOptimalResponse(savedResponses).concept_results);
        assert.equal(returnValue.parent_id, getTopOptimalResponse(savedResponses).id);
    });

})
