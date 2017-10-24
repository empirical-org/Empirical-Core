import { assert } from 'chai';
import {train, edits} from '../src/main'

describe('The train function', () => {
    it('Should take \n seperated words in a list', () => {
        const dict = 'misspelled\nforked';
        const dictionary = train(dict);
        assert.deepEqual(dictionary, {
            misspelled: 1,
            forked: 1,
        });
    });
});

describe('The edits function', () => {
    it('Should take take a word and return potential edits.', () => {
        // const dict = 'misspelled\nforked';
        // const dictionary = train(dict);

        const potentialEdits = edits("ryan")
        console.log(potentialEdits)
        assert.deepEqual(potentialEdits.length, 241);
    });
});

