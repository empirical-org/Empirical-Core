const questionPrompt: string = "Bats have wings. They can fly."
import { assert } from 'chai';
import { match } from 'react-router';

import {checkSentenceCombining} from './sentence_combining';

import {responses, focusPoints, incorrectSequences} from '../../../test/data/batswings'
import {Response} from '../../interfaces';
import { feedbackStrings, spellingFeedbackStrings } from '../constants/feedback_strings';
import {spacingBeforePunctuation} from '../algorithms/spacingBeforePunctuation'
import { conceptResultTemplate } from '../helpers/concept_result_template';


describe('The checking a sentence combining question', () => {

  describe('first matchers - original sentence', () => {
    it('should be able to find an exact match', () => {
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, responses[0].text, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.id, responses[0].id);
    });

    it('should be able to find a match, even with trailing spaces', () => {
      const questionString = 'Bats have wings, so they can fly. '
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.id, responses[1].id);
    });

    it('should be able to find a match, even with extra spaces', () => {
      const questionString = 'Bats have wings, so  they can fly.'
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.id, responses[1].id);
    });

    it('should be able to find a focus point match', () => {
      const questionString = 'Bats have wings, but they can fly.'
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      assert.equal(matchedResponse.feedback, focusPoints[0].feedback);
    });

    it('should be able to find an incorrect sequence match', () => {
      // this is a little artificial, as the focus point (looking for the word 'so') encompasses the incorrect sequence (using the phrase 'and they')
      const questionString = 'So bats have wings and they can fly.'
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, incorrectSequences[0].feedback);
    });

    it('should be able to find a case insensitive match', () => {
      const questionString = "bats have wings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.caseError);
    });

    it('should be able to find a punctuation insensitive match', () => {
      const questionString = "Bats have wings so they can fly"
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.punctuationError);
    });

    it('should be able to find a punctuation and case insensitive match', () => {
      const questionString = "bats have wings so they can fly"
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.punctuationAndCaseError);
    });

    it('should be able to find a spacing before punctuation match', () => {
      const questionString = "Bats have wings, so they can fly ."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, spacingBeforePunctuation(questionString).feedback);
    });

    it('should be able to find a spacing after comma match', () => {
      const questionString = "Bats have wings,so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.spacingAfterCommaError);
    });

    it('should be able to find a missing whitespace match', () => {
      const questionString = "Batshave wings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.missingWhitespaceError);
    });

    it('should be able to find an extra whitespace match', () => {
      const questionString = "Bats have wi ngs, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.extraWhitespaceError);
    });

    it('should be able to find a rigid change match', () => {
      const questionString = "Bats wings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.missingWordError);
    });

    it('should add spelling concept result to concept results', () => {
      const questionString = "Batss wings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.spelling_error, true);
      assert.include(matchedResponse.concept_results, conceptResultTemplate('H-2lrblngQAQ8_s-ctye4g'));
    });

  })

  describe('first matchers - spell-checked sentence', () => {
    it('should be able to find an exact match', () => {
      const questionString = 'Bts have wing, so they can fly.';
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, spellingFeedbackStrings["Spelling Hint"]);
      assert.equal(matchedResponse.parent_id, 13157);
      assert.equal(matchedResponse.optimal, null);
      assert.equal(matchedResponse.text, questionString);
      assert.equal(matchedResponse.spelling_error, true);
    });

    it('should be able to find a case insensitive match', () => {
      const questionString = "bats have zings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, spellingFeedbackStrings[matchedResponse.author]);
      assert.equal(matchedResponse.spelling_error, true);
    });

    it('should be able to find a punctuation insensitive match', () => {
      const questionString = "Bats have zings so they can fly"
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, spellingFeedbackStrings[matchedResponse.author]);
      assert.equal(matchedResponse.spelling_error, true);
    });

    it('should be able to find a punctuation and case insensitive match', () => {
      const questionString = "bats have zings so they can fly"
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, spellingFeedbackStrings[matchedResponse.author]);
      assert.equal(matchedResponse.spelling_error, true);
    });

    it('should be able to find a spacing before punctuation match', () => {
      const questionString = "Bats have zings, so they can fly ."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, spacingBeforePunctuation(questionString).feedback);
    });

    it('should be able to find a spacing after comma match', () => {
      const questionString = "Bats have zings,so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, spellingFeedbackStrings[matchedResponse.author]);
    });

    it('should be able to find a whitespace match', () => {
      const questionString = "Batshave zings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, spellingFeedbackStrings[matchedResponse.author]);
      assert.equal(matchedResponse.spelling_error, true);
    });

    it('should be able to find a rigid change match', () => {
      const questionString = "Bats zings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, spellingFeedbackStrings[matchedResponse.author]);
      assert.equal(matchedResponse.spelling_error, true);
      assert.equal(matchedResponse.misspelled_words[0], 'zings')
    });

    it('should be able to find a flexible change match', () => {
      const questionString = "Bats shave arms, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.author, 'Modified Word Hint');
      assert.equal(matchedResponse.spelling_error, true);
      assert.equal(matchedResponse.misspelled_words[0], 'shave')
    });

  })

  describe('second matchers - original sentence', () => {
    it('should be able to find a flexible change match', () => {
      const questionString = "Bats have arms, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.author, 'Modified Word Hint');
    });

    it('should be able to find a required words match', () => {
      const questionString = 'Bats have wings so fly."'
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, '<p>Revise your sentence to include the word <em>they</em>. You may have misspelled it.</p>');
    });

    it('should be able to find a case start match', () => {
      const questionString = "bats have wings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.caseError);
    });

    it('should be able to find a match even if some of the words are out of order.', () => {
      const questionString: string = "Bats have fly, so they can wings.";
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.wordsOutOfOrderError);
    });

    it('should be able to find a punctuation end match', () => {
      const questionString = "Bats have wings, so they can fly";
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.punctuationError);
    });

    it('should not return misspelled words array with second pass non-spelling feedback.', () => {
      const questionString: string = "Batss have fly, so they can wings.";
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      assert.equal(matchedResponse.feedback, feedbackStrings.wordsOutOfOrderError);
      assert.equal(matchedResponse.misspelled_words, undefined)
    });

  });

});
