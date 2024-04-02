import {assert} from 'chai'
import {spacyPOSSentenceMatch, spacyPOSSentenceChecker} from './spacy_pos_match'
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

function returnsCorrect() {
  return Promise.resolve({
    "child_count": 59,
    "concept_results": {
      "cdRJtgKMuGWdrjww3xXWjA": true
    },
    "count": 143,
    "feedback": "That's a strong sentence!",
    "first_attempt_count": 121,
    "id": 17655,
    "optimal": true,
    "parent_id": null,
    "pos": [
      "DT",
      "JJ",
      "NN",
      "VBD",
      "IN",
      "DT",
      "NN",
      "."
    ],
    "question_uid": "-KX7RNIvRs5HN9oD-vA2",
    "text": "The terrified scientist hid under the table."
  })
}

function returnsIncorrect() {
  return Promise.resolve({
    "child_count": 1,
    "concept_results": {
      "Tlhrx6Igxn6cR_SD1U5efA": false,
      "cdRJtgKMuGWdrjww3xXWjA": true
    },
    "count": 16,
    "feedback": "<p>You added an action. Good work! Now make the action word singular so it works with just <em>one</em> scientist.</p>",
    "first_attempt_count": 10,
    "id": 1646707,
    "optimal": false,
    "parent_id": null,
    "pos": [
      "DT",
      "JJ",
      "NN",
      "NN",
      "IN",
      "DT",
      "NN",
      "."
    ],
    "question_uid": "-KX7RNIvRs5HN9oD-vA2",
    "text": "The terrified scientist hide under the table."
  });
}

function returnsFalse() {
  return Promise.resolve(null)
}

describe('The machineLearningSentenceMatchChecker function', () => {

  it('should return a partialResponse object if the matcher returns a response', async () => {
    const responseString = "My goofy dog took a short nap.";
    const returnValue = await spacyPOSSentenceChecker(responseString, "-KX7RNIvRs5HN9oD-vA2", 'http://localhost:3100', returnsCorrect)
    assert.equal(returnValue.author, 'Parts of Speech');
    assert.equal(returnValue.feedback, "That's a strong sentence!");
    assert.equal(returnValue.optimal, true);
    assert.equal(returnValue.parent_id, 17655);

  });

  it('should return a partialResponse object if the matcher returns a response', async () => {
    const responseString = "My goofy dog took a short nap.";
    const returnValue = await spacyPOSSentenceChecker(responseString, "-KX7RNIvRs5HN9oD-vA2", 'http://localhost:3100', returnsIncorrect)
    assert.equal(returnValue.author, 'Parts of Speech');
    assert.equal(returnValue.feedback, "<p>You added an action. Good work! Now make the action word singular so it works with just <em>one</em> scientist.</p>");
    assert.equal(returnValue.optimal, false);
    assert.equal(returnValue.parent_id, 1646707);
  });

  it('should return a partialResponse object if the matcher returns false', async () => {
    const responseString = 'My grumpy dog took a nap.';
    const returnValue = await spacyPOSSentenceChecker(responseString, "-KX7RNIvRs5HN9oD-vA2", 'http://localhost:3100', returnsFalse)
    assert.equal(returnValue, undefined);
  });

});
