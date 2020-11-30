import { assert } from 'chai';

import {checkDiagnosticQuestion} from './diagnostic_question';

import { feedbackStrings } from '../constants/feedback_strings';
import {responses} from '../../../test/data/batswings'

describe('The checking a diagnostic question', () => {

  describe('first matchers - original sentence', () => {
    it('should be able to find an exact match', () => {
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, responses[0].text, responses, null, null, responses[0].question_uid);
      assert.equal(matchedResponse.id, responses[0].id);
    });

    it('should be able to find a  match, ignoring trailing spaces', () => {
      const questionString = "Bats have wings, so they can fly. "
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses, null, null, null);
      assert.equal(matchedResponse.id, responses[1].id);
    });

    it('should be able to find a  match, ignoring extra spaces', () => {
      const questionString = "Bats have wings,  so they can fly."
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses, null, null, null);
      assert.equal(matchedResponse.id, responses[1].id);
    });

    it('should be able to find a case insensitive match', () => {
      const questionString = "bats have wings, so they can fly."
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses, null, null, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.caseError);
    });

    it('should be able to find a punctuation insensitive match', () => {
      const questionString = "Bats have wings so they can fly"
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses, null, null, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.punctuationError);
    });

    it('should be able to find a punctuation and case insensitive match', () => {
      const questionString = "bats have wings so they can fly"
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses, null, null, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.punctuationAndCaseError);
    });

    it('should be able to find a whitespace match', () => {
      const questionString = "Batshave wings, so they can fly."
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses, null, null, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.missingWhitespaceError);
    });

    it('should be able to find a levenshtein change match', () => {
      const questionString = "Bats have swings, so they can fly."
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses, null, null, responses[0].question_uid);
      assert.equal(matchedResponse.author, 'Spelling Hint');
      assert.equal(matchedResponse.concept_results[0].conceptUID, responses[0].question_uid);
    });

  })

});
