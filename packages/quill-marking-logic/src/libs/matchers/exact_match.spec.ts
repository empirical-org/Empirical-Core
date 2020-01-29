import { assert } from 'chai';
import {exactMatch} from './exact_match'

describe('The exactMatch function', () => {

    it('Should take a response string and find the corresponding saved response if the string matches exactly', () => {
        const responseString = "My dog took a nap.";
        const savedResponses = [
          {
            id: 1,
            text: "My dog took a nap.",
            feedback: "Good job, that's a sentence!",
            optimal: true,
            count: 1,
            question_uid: 'questionOne'
          }
        ]
        const matchedResponse = exactMatch(responseString, savedResponses);
        assert.equal(matchedResponse.id, savedResponses[0].id);
    });

    it('Should take a response string and find the corresponding saved response if the string is a different casing and caseSensitive is false', () => {
      const responseString = "MY DOG TOOK A NAP.";
      const savedResponses = [
        {
          id: 1,
          text: "My dog took a nap.",
          feedback: "Good job, that's a sentence!",
          optimal: true,
          count: 1,
          question_uid: 'questionOne'
        }
      ]
      const caseSensitive = false
      const matchedResponse = exactMatch(responseString, savedResponses, caseSensitive);
      assert.equal(matchedResponse.id, savedResponses[0].id);
  });

});
