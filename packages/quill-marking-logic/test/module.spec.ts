const questionPrompt: string = "Bats have wings. They can fly.";
import { assert } from 'chai';

import {responses, focusPoints, incorrectSequences} from './data/batswings';

import {checkSentenceCombining} from '../src/libs/graders/sentence_combining';
import {Response} from '../src/interfaces';
import { feedbackStrings } from '../src/libs/constants/feedback_strings';
import {spacingBeforePunctuation} from '../src/libs/algorithms/spacingBeforePunctuation';

describe('The checking a sentence combining question from the lib', () => {

  describe('first matchers - original sentence', () => {
    it('should be able to find an exact match', () => {
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, responses[0].text, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.id, responses[0].id);
    });

    it('should be able to find a focus point match', () => {
      const questionString = 'Bats have wings, but they can fly."'
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, focusPoints[0].feedback);
    });

    it('should be able to find an incorrect sequence match', () => {
      // this is a little artificial, as the focus point (looking for the word 'so') encompasses the incorrect sequence (using the phrase 'and they')
      const questionString = 'So bats have wings and they can fly.'
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, incorrectSequences[0].feedback);
    });

    it('should be able to find a case insensitive match', () => {
      const questionString = "bats have wings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.caseError);
    });

    it('should be able to find a punctuation insensitive match', () => {
      const questionString = "Bats have wings so they can fly"
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.punctuationError);
    });

    it('should be able to find a punctuation and case insensitive match', () => {
      const questionString = "bats have wings so they can fly"
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.punctuationAndCaseError);
    });

    it('should be able to find a spacing before punctuation match', () => {
      const questionString = "Bats have wings, so they can fly ."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, spacingBeforePunctuation(questionString).feedback);
    });

    it('should be able to find a spacing after comma match', () => {
      const questionString = "Bats have wings,so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.spacingAfterCommaError);
    });

    it('should be able to find a whitespace match', () => {
      const questionString = "Batshave wings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.missingWhitespaceError);
    });

    it('should be able to find a rigid change match', () => {
      const questionString = "Bats wings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.missingWordError);
    });

  })

  describe('first matchers - spell-checked sentence', () => {
    it('should be able to find an exact match', () => {
      const questionString = "Bats have wing so, they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, "<p><em>So</em> tells why bats can fly. Good work! Now correct your punctuation.</p>");
    });

    it('should be able to find a focus point match', () => {
      const questionString = 'Bats have zings, and they can fly."'
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, focusPoints[0].feedback);
    });

    it('should be able to find an incorrect sequence match', () => {
      // this is a little artificial, as the focus point (looking for the word 'so') encompasses the incorrect sequence (using the phrase 'and they')
      const questionString = 'So bats have zings and they can fly.'
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, incorrectSequences[0].feedback);
    });

    it('should be able to find a case insensitive match', () => {
      const questionString = "bats have zings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.caseError);
    });

    it('should be able to find a punctuation insensitive match', () => {
      const questionString = "Bats have zings so they can fly"
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.punctuationError);
    });

    it('should be able to find a punctuation and case insensitive match', () => {
      const questionString = "bats have zings so they can fly"
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.punctuationAndCaseError);
    });

    it('should be able to find a spacing before punctuation match', () => {
      const questionString = "Bats have zings, so they can fly ."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, spacingBeforePunctuation(questionString).feedback);
    });

    it('should be able to find a spacing after comma match', () => {
      const questionString = "Bats have zings,so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.spacingAfterCommaError);
    });

    it('should be able to find a whitespace match', () => {
      const questionString = "Batshave zings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.missingWhitespaceError);
    });

    it('should be able to find a rigid change match', () => {
      const questionString = "Bats zings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.missingWordError);
    });

    it('should be able to find a flexible change match', () => {
      const questionString = "Bats shave arms, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.modifiedWordError);
    });

  })

  describe('second matchers - original sentence', () => {
    it('should be able to find a flexible change match', () => {
      const questionString = "Bats have arms, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.modifiedWordError);
    });

    it('should be able to find a required words match', () => {
      const questionString = 'Bats have wings so fly."'
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, '<p>Revise your sentence to include the word <em>they</em>. You may have misspelled it.</p>');
    });

    it('should be able to find a min length match', () => {
      // this is a little artificial, as the focus point (looking for the word 'so') encompasses the incorrect sequence (using the phrase 'and they')
      // const questionString = 'Bats have wings so they.'
      // const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      // assert.equal(matchedResponse.feedback, feedbackStrings.minLengthError);
    });

    it('should be able to find a max length match', () => {
      const questionString = "Bats have strong wings, so they can fly far away from home."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.maxLengthError);
    });

    it('should be able to find a case start match', () => {
      const questionString = "bats have wings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.caseError);
    });

    it('should be able to find a punctuation end match', () => {
      const questionString = "Bats and dogs have wings, so they can both fly"
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, feedbackStrings.punctuationError);
    });

  })

});
