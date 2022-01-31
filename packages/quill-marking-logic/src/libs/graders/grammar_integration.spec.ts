import { assert } from 'chai';
import {checkGrammarQuestion} from './grammar'
// import {checkGrammarQuestion} from '../../../dist/lib'
import {Response} from '../../interfaces'

describe('The checking a grammar question', () => {

  it('it should be able to grade it.', () => {
    const responseString: string = "My dog took a nap.";

    const savedResponses: Array<Response> = [
      {
        optimal: true,
        count: 1,
        text: "My dog took a nap.",
        question_uid: 'questionOne',
        feedback: "<b>Well done!</b> That's the correct answer."
      }
    ]
    const matchedResponse = checkGrammarQuestion('questionOne', responseString, savedResponses, [], [], 'conceptOne');
    assert.equal(matchedResponse.id, savedResponses[0].id);
  });

  it('it should be able to grade it even with trailing spaces.', () => {
    const responseString: string = "My dog took a nap. ";

    const savedResponses: Array<Response> = [
      {
        optimal: true,
        count: 1,
        text: "My dog took a nap.",
        question_uid: 'questionOne',
        feedback: "<b>Well done!</b> That's the correct answer."
      }
    ]
    const matchedResponse = checkGrammarQuestion('questionOne', responseString, savedResponses, [], [], 'conceptOne');
    assert.equal(matchedResponse.id, savedResponses[0].id);
  });

  it('it should be able to grade it even with extra spaces.', () => {
    const responseString: string = "My dog  took a nap.";

    const savedResponses: Array<Response> = [
      {
        optimal: true,
        count: 1,
        text: "My dog took a nap.",
        question_uid: 'questionOne',
        feedback: "<b>Well done!</b> That's the correct answer."
      }
    ]
    const matchedResponse = checkGrammarQuestion('questionOne', responseString, savedResponses, [], [], 'conceptOne');
    assert.equal(matchedResponse.id, savedResponses[0].id);
  });

  it('it should be able to grade it with spelling errors.', () => {
    const responseString: string = "My dg took a nap.";

    const savedResponses: Array<Response> = [
      {
        optimal: true,
        count: 1,
        text: "My dog took a nap.",
        question_uid: 'questionOne',
        feedback: "<b>Well done!</b> That's the correct answer."
      }
    ]
    assert.ok(checkGrammarQuestion('questionOne', responseString, savedResponses, [], [], 'conceptOne'));
  });


  it('it should be able to grade it with spelling and punctuation errors.', () => {
    const responseString: string = "My dg took a nap";

    const savedResponses: Array<Response> = [
      {
        optimal: true,
        count: 1,
        text: "My dog took a nap.",
        question_uid: 'questionOne',
        feedback: "<b>Well done!</b> That's the correct answer."
      }
    ]
    assert.ok(checkGrammarQuestion('questionOne', responseString, savedResponses, [], [], 'conceptOne'));
  });

  it('it should return a concept result with the default concept uid if nothing matches.', () => {
    const responseString: string = "What if you just can't match this?";

    const savedResponses: Array<Response> = [
      {
        optimal: true,
        count: 1,
        text: "My dog took a nap.",
        question_uid: 'questionOne',
        feedback: "<b>Well done!</b> That's the correct answer."
      }
    ]
    const matchedResponse = checkGrammarQuestion('questionOne', responseString, savedResponses, [], [], 'conceptOne');
    assert.equal(matchedResponse.concept_results[0].conceptUID, 'conceptOne');
  });

});
