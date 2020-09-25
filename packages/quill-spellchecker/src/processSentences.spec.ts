import { assert } from 'chai';

import {processSentences, uniqueWordsFromSentences} from  './processSentences'

describe('The processSentences function', () => {
  it('Should take an array of sentences and return \n separated words in a list', () => {
    const sentences = [
      'Even though teams may disagree, they support each other.',
      'Teams may disagree even though they support each other.',
      'Teams support each other even though they may disagree.',
      'Even though teams disagree, they support each other.'
    ]
    const expected = 'Even\nthough\nteams\nmay\ndisagree\nthey\nsupport\neach\nother\nTeams\nmay\ndisagree\neven\nthough\nthey\nsupport\neach\nother\nTeams\nsupport\neach\nother\neven\nthough\nthey\nmay\ndisagree\nEven\nthough\nteams\ndisagree\nthey\nsupport\neach\nother';
    assert.equal(processSentences(sentences), expected);
  });

  it('Should not take return a string with \n\n\ in it', () => {
    const sentences = [
      'Even though teams may disagree, they support each other.',
      undefined,
      'Teams support each other even though they may disagree.',
      'Even though teams disagree, they support each other.'
    ]
    const expected = 'Even\nthough\nteams\nmay\ndisagree\nthey\nsupport\neach\nother\nTeams\nsupport\neach\nother\neven\nthough\nthey\nmay\ndisagree\nEven\nthough\nteams\ndisagree\nthey\nsupport\neach\nother';
    assert.equal(processSentences(sentences), expected);
  })

  it('Should be able to return the unique words from the sentences', () => {
    const sentences = [
      'Even though teams may disagree, they support each other.',
      'Teams may disagree even though they support each other.',
      'Teams support each other even though they may disagree.',
      'Even though teams disagree, they support each other.'
    ]
    const expected = ['Even', 'though', 'teams', 'may', 'disagree', 'they', 'support', 'each', 'other', 'Teams', 'even'];
    assert.deepEqual(uniqueWordsFromSentences(sentences), expected);
  })

  
});