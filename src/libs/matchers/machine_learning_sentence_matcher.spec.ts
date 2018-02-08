const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised)
const assert = chai.assert
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

    it('should return a partialResponse object if the matcher returns true', () => {
      const responseString = "My goofy dog took a short nap.";
        const returnValue = machineLearningSentenceChecker(responseString, savedResponses, 'http://localhost:3100', returnsTrue)
        assert.eventually.equal(returnValue.author, savedResponses[1].author);
        assert.eventually.equal(returnValue.feedback, savedResponses[1].feedback);
        assert.eventually.equal(returnValue.optimal, savedResponses[1].optimal);
        assert.eventually.equal(returnValue.concept_results, savedResponses[1].concept_results);
        assert.eventually.equal(returnValue.parent_id, savedResponses[1].id);

    });

    it('should return undefined if the matcher returns false', () => {
        const responseString = 'My grumpy dog took a nap.';
        const returnValue = machineLearningSentenceChecker(responseString, savedResponses, 'http://localhost:3100', returnsFalse)
        assert.notOk(returnValue);
    });

})
