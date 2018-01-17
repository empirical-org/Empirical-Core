import { assert } from 'chai';
import {requiredWordsMatch} from './required_words_match'
import {Response} from '../../interfaces'

describe('The requiredWordsMatch function', () => {

    it('Should take a response string and return a feedback object if it is missing a required word', () => {
        const responseString = "My dog took a.";
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
        assert.ok(requiredWordsMatch(responseString, savedResponses));
    });

});
