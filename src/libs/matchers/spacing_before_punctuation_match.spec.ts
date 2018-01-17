import { assert } from 'chai';
import {spacingBeforePunctuationMatch} from './spacing_before_punctuation_match'
import {Response} from '../../interfaces'

describe('The spacingBeforePunctuationMatch function', () => {

    it('Should take a response string and return a feedback object if there is space before punctuation marks', () => {
        const responseString = "My dog took a nap .";
        const matchedResponse = spacingBeforePunctuationMatch(responseString);
        assert.isOk(matchedResponse);
    });

});
