import {responses} from '../../../test/data/batswings'
import { assert } from 'chai';
import {checkFillInTheBlankQuestion} from '../../../dist/lib'
// import {checkFillInTheBlankQuestion} from './fill_in_the_blank';
import {Response} from '../../interfaces';
import { feedbackStrings } from '../constants/feedback_strings';

describe('The checking a fill in the blank question', () => {

  describe('first matchers - original sentence', () => {
    it('should be able to find an exact match', () => {
      const matchedResponse = checkFillInTheBlankQuestion(responses[0].question_uid, responses[0].text, responses);
      assert.equal(matchedResponse.id, responses[0].id);
    });

    it('should be able to find a case insensitive match', () => {
      const questionString = "bats have wings, so they can fly."
      const matchedResponse = checkFillInTheBlankQuestion(responses[0].question_uid, questionString, responses);
      assert.equal(matchedResponse.feedback, feedbackStrings.caseError);
    });

    it('should be able to find a case insensitive match even with trailing whitespace', () => {
      const questionString = "bats have wings, so they can fly. "
      const matchedResponse = checkFillInTheBlankQuestion(responses[0].question_uid, questionString, responses);
      assert.equal(matchedResponse.feedback, feedbackStrings.caseError);
    });

  })

});
