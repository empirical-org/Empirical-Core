const questionPrompt: string = "Bats have wings. They can fly."
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
      expect(matchedResponse.id).toEqual(responses[0].id);
    });

    it('should be able to find a match, even with trailing spaces', () => {
      const questionString = 'Bats have wings, so they can fly. '
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      expect(matchedResponse.id).toEqual(responses[1].id);
    });

    it('should be able to find a match, even with extra spaces', () => {
      const questionString = 'Bats have wings, so  they can fly.'
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      expect(matchedResponse.id).toEqual(responses[1].id);
    });

    it('should be able to find a focus point match', () => {
      const questionString = 'Bats have wings, but they can fly.'
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
      expect(matchedResponse.feedback).toEqual(focusPoints[0].feedback);
    });

    it('should be able to find an incorrect sequence match', () => {
      // this is a little artificial, as the focus point (looking for the word 'so') encompasses the incorrect sequence (using the phrase 'and they')
      const questionString = 'So bats have wings and they can fly.'
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(incorrectSequences[0].feedback);
    });

    it('should be able to find a case insensitive match', () => {
      const questionString = "bats have wings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(feedbackStrings.caseError);
    });

    it('should be able to find a punctuation insensitive match', () => {
      const questionString = "Bats have wings so they can fly"
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(feedbackStrings.punctuationError);
    });

    it('should be able to find a punctuation and case insensitive match', () => {
      const questionString = "bats have wings so they can fly"
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(feedbackStrings.punctuationAndCaseError);
    });

    it('should be able to find a spacing before punctuation match', () => {
      const questionString = "Bats have wings, so they can fly ."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(spacingBeforePunctuation(questionString).feedback);
    });

    it('should be able to find a spacing after comma match', () => {
      const questionString = "Bats have wings,so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(feedbackStrings.spacingAfterCommaError);
    });

    it('should be able to find a missing whitespace match', () => {
      const questionString = "Batshave wings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(feedbackStrings.missingWhitespaceError);
    });

    it('should be able to find an extra whitespace match', () => {
      const questionString = "Bats have wi ngs, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(feedbackStrings.extraWhitespaceError);
    });

    it('should be able to find a rigid change match', () => {
      const questionString = "Bats wings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(feedbackStrings.missingWordError);
    });

    it('should add spelling concept result to concept results', () => {
      const questionString = "Batss have wi ngs, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.spelling_error).toEqual(true);
      expect(matchedResponse.concept_results).toContainEqual(conceptResultTemplate('H-2lrblngQAQ8_s-ctye4g'))
    });

    it('should add spelling concept result to concept results if there are two or more spelling errors', () => {
      const questionString = "Batss have wi ngss, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.spelling_error).toEqual(true);
      expect(matchedResponse.concept_results).toContainEqual(conceptResultTemplate('H-2lrblngQAQ8_s-ctye4g'))
    });

  })

  describe('first matchers - spell-checked sentence', () => {
    it('should be able to find an exact match', () => {
      const questionString = 'Bts have wing, so they can fly.';
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(spellingFeedbackStrings["Spelling Hint"]);
      expect(matchedResponse.parent_id).toEqual(13157);
      expect(matchedResponse.optimal).toEqual(undefined);
      expect(matchedResponse.text).toEqual(questionString);
      expect(matchedResponse.spelling_error).toEqual(true);
    });

    it('should be able to find a case insensitive match', () => {
      const questionString = "bats have zings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(spellingFeedbackStrings[matchedResponse.author]);
      expect(matchedResponse.spelling_error).toEqual(true);
    });

    it('should be able to find a punctuation insensitive match', () => {
      const questionString = "Bats have zings so they can fly"
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(spellingFeedbackStrings[matchedResponse.author]);
      expect(matchedResponse.spelling_error).toEqual(true);
    });

    it('should be able to find a punctuation and case insensitive match', () => {
      const questionString = "bats have zings so they can fly"
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(spellingFeedbackStrings[matchedResponse.author]);
      expect(matchedResponse.spelling_error).toEqual(true);
    });

    it('should be able to find a spacing before punctuation match', () => {
      const questionString = "Bats have zings, so they can fly ."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(spacingBeforePunctuation(questionString).feedback);
    });

    it('should be able to find a spacing after comma match', () => {
      const questionString = "Bats have zings,so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(spellingFeedbackStrings[matchedResponse.author]);
    });

    it('should be able to find a whitespace match', () => {
      const questionString = "Batshave zings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(spellingFeedbackStrings[matchedResponse.author]);
      expect(matchedResponse.spelling_error).toEqual(true);
    });

    it('should be able to find a rigid change match', () => {
      const questionString = "Bats zings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(spellingFeedbackStrings[matchedResponse.author]);
      expect(matchedResponse.spelling_error).toEqual(true);
      expect(matchedResponse.misspelled_words).toEqual(undefined)
    });

    it('should be able to find a flexible change match', () => {
      const questionString = "Bats shave arms, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.author).toEqual('Modified Word Hint');
      expect(matchedResponse.spelling_error).toEqual(true);
      expect(matchedResponse.misspelled_words[0]).toEqual('shave')
    });

  })

  describe('second matchers - original sentence', () => {
    it('should be able to find a flexible change match', () => {
      const questionString = "Bats have arms, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.author).toEqual('Modified Word Hint');
    });

    it('should be able to find a required words match', () => {
      const questionString = 'Bats have wings so.'
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual('<p>Revise your sentence to include the word <em>they</em>. You may have misspelled it.</p>');
    });

    it('should be able to find a case start match', () => {
      const questionString = "bats have wings, so they can fly."
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(feedbackStrings.caseError);
    });

    it('should be able to find a match even if some of the words are out of order.', () => {
      const questionString: string = "Bats have fly, so they can wings.";
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(feedbackStrings.wordsOutOfOrderError);
    });

    it('should be able to find a quotation mark match', () => {
      const questionString = "Bats have wings \'\' so they can fly.";
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(feedbackStrings.quotationMarkError);
    });

    it('should be able to find a punctuation end match', () => {
      const questionString = "Bats have wings, so they can fly";
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(feedbackStrings.punctuationError);
    });

    it('should not return misspelled words array with second pass non-spelling feedback.', () => {
      const questionString: string = "Batss have fly, so they can wings.";
      const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, responses[0].question_uid);
      expect(matchedResponse.feedback).toEqual(feedbackStrings.wordsOutOfOrderError);
      expect(matchedResponse.misspelled_words).toEqual(undefined)
    });

  });

});
