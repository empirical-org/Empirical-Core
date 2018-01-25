const questionPrompt: string = "Bats have wings. They can fly."
import {responses, focusPoints, incorrectSequences} from '../../../test/data/batswings'
import { assert } from 'chai';
import {checkSentenceCombining} from './sentence_combining';
import {Response} from '../../interfaces';
import FEEDBACK_STRINGS from '../constants/feedback_strings';

describe('The checking a sentence combining question', () => {

  it('should be able to find an exact match', () => {
    const matchedResponse = checkSentenceCombining(responses[0].question_uid, responses[0].text, responses, focusPoints, incorrectSequences);
    assert.equal(matchedResponse.id, responses[0].id);
  });

  it('should be able to find a focus point match', () => {
    const questionString = 'Bats have wings, but they can fly."'
    const matchedResponse = checkSentenceCombining(responses[0].question_uid, questionString, responses, focusPoints, incorrectSequences);
    assert.equal(matchedResponse.feedback, focusPoints[0].feedback);
  });


});
