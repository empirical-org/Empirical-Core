import { assert } from 'chai';
import {caseStartMatch} from './case_start_match'
import {Response} from '../../interfaces'

describe('The caseStartMatch function', () => {

    it('Should take a response string and find top optimal response if the response string starts with a lowercase letter', () => {
        const responseString = "my dog took a nap.";
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
        const matchedResponse: Response = caseStartMatch(responseString, savedResponses);
        assert.equal(matchedResponse.id, savedResponses[0].id);
    });

});
