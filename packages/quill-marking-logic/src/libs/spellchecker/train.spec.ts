import { assert } from 'chai';
import {train} from './train';

describe('The train function', () => {
  it('Should take \n seperated words in a list', () => {
    const dict = 'misspelled\nforked';
    const dictionary = train(dict);
    assert.deepEqual(dictionary, {
      misspelled: 1,
      forked: 1,
    });
  });

  it('can update existing dictionaries', () => {
    const firstDict = 'misspelled\nforked';
    const firstDictionary = train(firstDict);
    const secondDict = 'funny\nhilarious';
    const secondDictionary = train(secondDict, firstDictionary);
    assert.deepEqual(secondDictionary, {
      misspelled: 1,
      forked: 1,
      funny: 1,
      hilarious: 1,
    });
  });

  it('can update existing dictionaries and keep correct counts', () => {
    const firstDict = 'misspelled\nforked';
    const firstDictionary = train(firstDict);
    const secondDict = 'misspelled\nforked\nfunny\nhilarious';
    const secondDictionary = train(secondDict, firstDictionary);
    assert.deepEqual(secondDictionary, {
      misspelled: 2,
      forked: 2,
      funny: 1,
      hilarious: 1,
    });
  });

  it('is case sensitive', () => {
    const dict = 'Misspelled\nforked';
    const dictionary = train(dict);
    assert.deepEqual(dictionary, {
      Misspelled: 1,
      forked: 1,
    });
  })

  it('is treats different casess correctly', () => {
    const dict = 'Misspelled\nmisspelled\nforked';
    const dictionary = train(dict);
    assert.deepEqual(dictionary, {
      Misspelled: 1,
      misspelled: 1,
      forked: 1,
    });
  })
});