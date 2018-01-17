import { assert } from 'chai';
import {spacingAfterCommaMatch} from './spacing_after_comma_match'
import {Response} from '../../interfaces'

describe('The spacingAfterCommaMatch function', () => {

    it('Should take a response string and return a feedback object if there is no space after a comma', () => {
        const responseString = "My dog took a nap,did yours?";
        const matchedResponse = spacingAfterCommaMatch(responseString);
        assert.isOk(matchedResponse);
    });

});
