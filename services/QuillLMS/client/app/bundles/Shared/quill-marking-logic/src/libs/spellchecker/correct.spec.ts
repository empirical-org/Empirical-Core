import { correct } from './correct';
import { Dictionary } from './dictionary';

describe('The correct function', () => {

  const dictionary: Dictionary = {
    "misspelled": 1,
    "forked": 1,
  }

  it('Should take a word and correct it if appropriate.', () => {
    const correctWord = correct(dictionary, "mispeled");
    expect(correctWord).toEqual('misspelled');
  });

  it('Should take take a word correct it if appropriate.', () => {
    const correctWord = correct(dictionary, "mspeled");;
    expect(correctWord).toEqual('mspeled');
  });

  it('Should find a capitalized word if the dictionary contains it.', () => {
    const correctWord = correct(dictionary, "Ethiopia");;
    expect(correctWord).toEqual('Ethiopia');
  });
});
