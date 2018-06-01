import { assert } from 'chai';
import {processSentence} from  './processSentence'

describe('The processSentence function', () => {
  it('Should take a sentence and return \n seperated words in a list', () => {
    const sentence = "Even though teams may disagree, they support each other."
    const expected = "Even\nthough\nteams\nmay\ndisagree\nthey\nsupport\neach\nother"
    assert.equal(processSentence(sentence), expected);
  });

  it('should return an empty string if given no argument', () => {
    const sentence = undefined;
    const expected = '';
    assert.equal(processSentence(sentence), expected);
  });
})