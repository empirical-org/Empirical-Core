import { assert } from 'chai';

import {punctuationEndMatch} from './punctuation_end_match'

import {Response} from '../../interfaces'

describe('The punctuationEndMatch function', () => {

    it('Should take a response string and find top optimal response if the response string ends with a letter', () => {
        const responseString = "My dog took a nap";
        const savedResponses: Array<Response> = [
          {
            id: 1,
            text: "My dog took a nap.",
            feedback: "Good job, that's a sentence!",
            optimal: true,
            count: 2,
            question_uid: "questionOne"
          },
          {
            id: 2,
            text: "My dog took another nap.",
            feedback: "Good job, that's a sentence!",
            optimal: true,
            count: 1,
            question_uid: "questionTwo"
          }
        ]
        assert.ok(punctuationEndMatch(responseString, savedResponses));
    });

});
