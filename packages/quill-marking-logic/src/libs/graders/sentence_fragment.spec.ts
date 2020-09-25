import { assert } from 'chai';

import {checkSentenceFragment} from './sentence_fragment'

import {Response} from '../../interfaces'

describe('The checking a sentence fragment', () => {

  it('it should be able to grade it.', () => {
    const responseString: string = "My dog took a nap.";

    const savedResponses: Array<Response> = [
      {
        id: 1,
        text: "My dog took a nap.",
        feedback: "Good job, that's a sentence!",
        optimal: true,
        count: 1,
        question_uid: 'questionOne'
      },
      {
        id: 2,
        text: "My cat took a nap.",
        feedback: "The animal woofs so try again!",
        optimal: false,
        count: 1,
        question_uid: 'questionOne'
      }
    ];
    const matchedResponse = checkSentenceFragment({
      question_uid: 'questionOne',
      response: responseString,
      responses: savedResponses,
      wordCountChange: {min: 1, max: 3},
      ignoreCaseAndPunc: false,
      incorrectSequences: [],
      prompt: 'My dog took nap.'});
    matchedResponse.then(resp => {
      assert.equal(resp.id, savedResponses[0].id);
    });
  });

  it('it should be able to grade it even with trailing whitespace', () => {
    const responseString: string = "My dog took a nap. ";

    const savedResponses: Array<Response> = [
      {
        id: 1,
        text: "My dog took a nap.",
        feedback: "Good job, that's a sentence!",
        optimal: true,
        count: 1,
        question_uid: 'questionOne'
      },
      {
        id: 2,
        text: "My cat took a nap.",
        feedback: "The animal woofs so try again!",
        optimal: false,
        count: 1,
        question_uid: 'questionOne'
      }
    ];
    const matchedResponse = checkSentenceFragment({
      question_uid: 'questionOne',
      response: responseString,
      responses: savedResponses,
      wordCountChange: {min: 1, max: 3},
      ignoreCaseAndPunc: false,
      incorrectSequences: [],
      prompt: 'My dog took nap.'});
    matchedResponse.then(resp => {
      assert.equal(resp.id, savedResponses[0].id);
    });
  });

  it('it should be able to grade it even with leading whitespace.', () => {
    const responseString: string = " My dog took a nap.";

    const savedResponses: Array<Response> = [
      {
        id: 1,
        text: "My dog took a nap.",
        feedback: "Good job, that's a sentence!",
        optimal: true,
        count: 1,
        question_uid: 'questionOne'
      },
      {
        id: 2,
        text: "My cat took a nap.",
        feedback: "The animal woofs so try again!",
        optimal: false,
        count: 1,
        question_uid: 'questionOne'
      }
    ];
    const matchedResponse = checkSentenceFragment({
      question_uid: 'questionOne',
      response: responseString,
      responses: savedResponses,
      wordCountChange: {min: 1, max: 3},
      ignoreCaseAndPunc: false,
      incorrectSequences: [],
      prompt: 'My dog took nap.'});
    matchedResponse.then(resp => {
      assert.equal(resp.id, savedResponses[0].id);
    });
  });

});
