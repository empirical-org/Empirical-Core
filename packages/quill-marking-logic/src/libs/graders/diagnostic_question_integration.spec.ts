import {responses} from '../../../test/data/batswings'
import { assert } from 'chai';
// import {checkDiagnosticQuestion} from '../../../dist/lib'
import {checkDiagnosticQuestion} from './diagnostic_question';
import {Response} from '../../interfaces';
import { feedbackStrings } from '../constants/feedback_strings';

describe('The checking a diagnostic question', () => {

  describe('first matchers - original sentence', () => {
    it('should be able to find an exact match', () => {
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, responses[0].text, responses);
      assert.equal(matchedResponse.id, responses[0].id);
    });

    it('should be able to find a case insensitive match', () => {
      const questionString = "bats have wings, so they can fly."
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses);
      assert.equal(matchedResponse.feedback, feedbackStrings.caseError);
    });

    it('should be able to find a punctuation insensitive match', () => {
      const questionString = "Bats have wings so they can fly"
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses);
      assert.equal(matchedResponse.feedback, feedbackStrings.punctuationError);
    });

    it('should be able to find a punctuation and case insensitive match', () => {
      const questionString = "bats have wings so they can fly"
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses);
      assert.equal(matchedResponse.feedback, feedbackStrings.punctuationAndCaseError);
    });

    it('should be able to find a whitespace match', () => {
      const questionString = "Batshave wings, so they can fly."
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses);
      assert.equal(matchedResponse.feedback, feedbackStrings.whitespaceError);
    });

    it('should be able to find a levenshtein change match', () => {
      const questionString = "Bats have swings, so they can fly."
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses);
      assert.equal(matchedResponse.author, 'Spelling Hint');
    });

  })

});
