import { assert } from 'chai';
import {punctuationAndCaseInsensitiveMatch} from './punctuation_and_case_insensitive_match'
import {Response} from '../../interfaces'

describe('The punctuationInsensitiveMatch function', () => {

    it('Should take a response string and find the corresponding saved response if the string matches exactly when punctuation is removed and both are downcased', () => {
        const responseString = "my dog took a nap";
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
        const matchedResponse: Response = punctuationAndCaseInsensitiveMatch(responseString, savedResponses);
        assert.equal(matchedResponse.id, savedResponses[0].id);
    });

});
