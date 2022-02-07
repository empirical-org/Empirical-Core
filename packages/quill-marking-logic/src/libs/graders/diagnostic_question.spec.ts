import { assert } from 'chai';
import {checkDiagnosticQuestion} from './diagnostic_question'
import {Response} from '../../interfaces'

describe('The checking a diagnostic question', () => {

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
    const matchedResponse = checkDiagnosticQuestion('questionOne', responseString, savedResponses, null, null);
    assert.equal(matchedResponse.id, savedResponses[0].id);
  });

  it('it should be able to grade it even with trailing whitespace.', () => {
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
    ]
    const matchedResponse = checkDiagnosticQuestion('questionOne', responseString, savedResponses, null, null);
    assert.equal(matchedResponse.id, savedResponses[0].id);
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
    ]
    const matchedResponse = checkDiagnosticQuestion('questionOne', responseString, savedResponses, null, null);
    assert.equal(matchedResponse.id, savedResponses[0].id);
  });

});
