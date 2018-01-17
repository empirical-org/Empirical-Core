import { assert } from 'chai';
import {maxLengthMatch} from './max_length_match'
import {Response} from '../../interfaces'

describe('The maxLengthMatch function', () => {

    it('Should take a response string and find the longest optimal response if the response string is at least two words longer than any of them and there are at least two optimal responses', () => {
        const responseString = "My goofy dog took a very long nap.";
        const savedResponses: Array<Response> = [
          {
            id: 1,
            text: "My sleepy dog took a nap.",
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
            question_uid: 'question 2'
          }
        ]
        const matchedResponse: Response = maxLengthMatch(responseString, savedResponses);
        assert.equal(matchedResponse.id, savedResponses[0].id);
    });

    it('Should take a response string and return undefined if it is longer than the longest optimal response by one word', () => {
      const responseString = "My goofy dog took a very long nap.";
        const savedResponses: Array<Response> = [
          {
            id: 1,
            text: "My sleepy dog took a nap.",
            feedback: "Good job, that's a sentence!",
            optimal: true,
            count: 1,
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
        assert.notOk(maxLengthMatch(responseString, savedResponses));
    });

    it('Should take a response string and return undefined if there are not at least two optimal responses', () => {
      const responseString = "My goofy dog took a very long nap.";
        const savedResponses: Array<Response> = [
          {
            id: 1,
            text: "My sleepy dog took a nap.",
            feedback: "Good job, that's a sentence!",
            optimal: true,
            count: 1,
            question_uid: 'question 1'
          },
          {
            id: 2,
            text: "My dog took a nap.",
            feedback: "Good job, that's a sentence!",
            optimal: false,
            count: 1,
            question_uid: 'question 2'
          }
        ]
        assert.notOk(maxLengthMatch(responseString, savedResponses));
    });

});
