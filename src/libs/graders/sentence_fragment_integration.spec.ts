import {responses, incorrectSequences} from '../../../test/data/batswings'
import { assert } from 'chai';
import {checkSentenceFragment} from './sentence_fragment'
// import {checkSentenceFragment} from '../../../dist/lib'
import {partsOfSpeechChecker} from '../matchers/parts_of_speech_match'
import {Response} from '../../interfaces';
import { feedbackStrings } from '../constants/feedback_strings';
import {spacingBeforePunctuation} from '../algorithms/spacingBeforePunctuation'

describe('The checking a sentence fragment', () => {
  const initialFields = {
    question_uid: 'questionOne',
    response: responses[0].text,
    responses,
    wordCountChange: {min: 1, max: 3},
    ignoreCaseAndPunc: false,
    incorrectSequences,
    prompt: 'Bats have wings they can fly.'
  };

  describe('first matchers - original sentence', () => {
    it('should be able to find an exact match', () => {
      const fields = {
        ...initialFields,
        question_uid: responses[0].question_uid,
        wordCountChange: {min: 1, max: 4}
      };
      const matchedResponse = checkSentenceFragment(fields);
      assert.equal(matchedResponse.id, responses[0].id);
    });

    it('should be able to find an incorrect sequence match', () => {
      // this is a little artificial, as the focus point (looking for the word 'so') encompasses the incorrect sequence (using the phrase 'and they')
      const fields = {
        ...initialFields,
        response: 'So bats have wings and they can fly.',
      };
      const matchedResponse = checkSentenceFragment(fields);
      assert.equal(matchedResponse.feedback, incorrectSequences[0].feedback);
    });
    //
    it('should be able to find a length match', () => {
      const fields = {
        ...initialFields,
        response: 'Bats have wings, which means that they can fly very far.',
      };
      const matchedResponse = checkSentenceFragment(fields);
      assert.equal(matchedResponse.feedback, 'Revise your work. Add one to three words to the prompt to make the sentence complete.');
    })

    it('should be able to find a case insensitive match', () => {
      const fields = {
        ...initialFields,
        response: "bats have wings, so they can fly.",
      };
      const matchedResponse = checkSentenceFragment(fields);
      assert.equal(matchedResponse.feedback, feedbackStrings.caseError);
    });

    it('should be able to find a punctuation insensitive match', () => {
      const fields = {
        ...initialFields,
        response: "Bats have wings so they can fly far",
      };
      const matchedResponse = checkSentenceFragment(fields);
      assert.equal(matchedResponse.feedback, feedbackStrings.punctuationError);
    });

    it('should be able to find a punctuation and case insensitive match', () => {
      // const responseString = "bats have wings so they can fly."
      // const matchedResponse = checkSentenceFragment('questionOne', responseString, responses, {min: 1, max: 3}, false, incorrectSequences, 'Bats have wings they can fly.');
      // assert.equal(matchedResponse.feedback, feedbackStrings.punctuationAndCaseError);
    });

    it('should be able to find a spacing before punctuation match', () => {
      const fields = {
        ...initialFields,
        response: "Bats have wings so they can fly far .",
      };
      const matchedResponse = checkSentenceFragment(fields);
      assert.equal(matchedResponse.feedback, spacingBeforePunctuation("Bats have wings so they can fly far .").feedback);
    });

    it('should be able to find a spacing after comma match', () => {
      const fields = {
        ...initialFields,
        response: "Bats have wings,so they can fly far.",
      };
      const matchedResponse = checkSentenceFragment(fields);
      assert.equal(matchedResponse.feedback, feedbackStrings.spacingAfterCommaError);
    });
  });
});
