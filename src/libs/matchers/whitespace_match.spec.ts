import { assert } from 'chai';
import {whitespaceMatch} from './whitespace_match'
import {Response} from '../../interfaces'

describe('The exactMatch function', () => {

    it('Should take a response string and find the corresponding saved response if the string matches when whitespace is removed', () => {
        const responseString:string = "Mydogtookanap.";
        const savedResponses: Array<Response> = [
          {
            id: 1,
            text: "My dog took a nap.",
            feedback: "Good job, that's a sentence!",
            optimal: true,
            count: 1,
            question_uid: "questionOne"
          }
        ]
        const matchedResponse = whitespaceMatch(responseString, savedResponses);
        assert.equal(matchedResponse.id, savedResponses[0].id);
    });

});
