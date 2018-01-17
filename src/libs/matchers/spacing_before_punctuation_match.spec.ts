import { assert } from 'chai';
import {spacingBeforePunctuationMatch} from './spacing_before_punctuation_match'
import {Response} from '../../interfaces'

describe('The spacingBeforePunctuationMatch function', () => {

    it('Should take a response string and find the corresponding saved response if the string matches exactly when punctuation is removed', () => {
        const responseString = "My dog took a nap .";
        const matchedResponse = spacingBeforePunctuationMatch(responseString);
        assert.isOk(matchedResponse.feedback);
    });

});
