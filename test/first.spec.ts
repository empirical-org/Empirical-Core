import { assert } from 'chai';
import {train, edits, correct} from '../src/main'

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
        const potentialEdits = edits("ryan");
        assert.deepEqual(potentialEdits.length, 241);
    });
});

describe('The correct function', () => {
    const dict = 'misspelled\nforked';
    const dictionary = train(dict);

    it('Should take a word and correct it if appropriate.', () => {
        const correctWord = correct(dictionary, "mispeled");
        assert.equal(correctWord, 'misspelled');
    });

    it('Should take take a word correct it if appropriate.', () => {
        const correctWord = correct(dictionary, "mspeled");;
        assert.equal(correctWord, 'mspeled');
    });
});

