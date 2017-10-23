import { assert } from 'chai';
import {train} from '../src/main'

describe('The train function', () => {
    it('Should take \n seperated words in a list', () => {
        const dict = 'misspelled\nforked';
        const dictionary = train(dict);
        assert.deepEqual(dictionary, {
            misspelled: 1,
            forked: 1,
            please: 2,
        });
    });
});
