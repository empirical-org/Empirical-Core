import {checkDiagnosticQuestion} from './diagnostic_question';

import { feedbackStrings } from '../constants/feedback_strings';
import {responses, focusPoints, incorrectSequences} from '../../../test/data/batswings'

describe('The checking a diagnostic question', () => {

  describe('first matchers - original sentence', () => {
    it('should be able to find an exact match', () => {
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, responses[0].text, responses, null, null, responses[0].question_uid);
      expect(matchedResponse.id).toEqual(responses[0].id);
    });

    it('should be able to find a  match, ignoring trailing spaces', () => {
      const questionString = "Bats have wings, so they can fly. "
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses, null, null, null);
      expect(matchedResponse.id).toEqual(responses[1].id);
    });

    it('should be able to find a  match, ignoring extra spaces', () => {
      const questionString = "Bats have wings,  so they can fly."
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses, null, null, null);
      expect(matchedResponse.id).toEqual(responses[1].id);
    });

    it('should be able to find a focus points match', () => {
      const questionString = 'Bats have wings, but they can fly.'
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, null);
      expect(matchedResponse.feedback).toEqual(focusPoints[0].feedback);
    });

    it('should be able to find an incorrect sequence match', () => {
      const questionString = 'So bats have wings and they can fly.'
      const matchedResponse = checkDiagnosticQuestion(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences, null);
      expect(matchedResponse.feedback).toEqual(incorrectSequences[0].feedback);
      expect(matchedResponse.author).toEqual(incorrectSequences[0].name);
    });

  })

});
