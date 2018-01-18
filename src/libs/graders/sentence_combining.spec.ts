import { assert } from 'chai';
import {checkAnswer} from './sentence_combining'
import {Response} from '../../interfaces'

describe('The checking a sentence combining question', () => {

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
        ]
        const matchedResponse = checkAnswer(responseString, savedResponses, null, null);
        assert.equal(matchedResponse.id, savedResponses[0].id);
    });

});
