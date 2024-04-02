import { assert } from 'chai';
import { correct } from './correct';
import { Dictionary } from './dictionary';

describe('The correct function', () => {

  const dictionary: Dictionary = {
    "misspelled": 1,
    "forked": 1,
  }

  it('Should take a word and correct it if appropriate.', () => {
    const correctWord = correct(dictionary, "mispeled");
    assert.equal(correctWord, 'misspelled');
  });

  it('Should take take a word correct it if appropriate.', () => {
    const correctWord = correct(dictionary, "mspeled");;
    assert.equal(correctWord, 'mspeled');
  });

  it('Should find a capitalized word if the dictionary contains it.', () => {
    const correctWord = correct(dictionary, "Ethiopia");;
    assert.equal(correctWord, 'Ethiopia');
  });
});
