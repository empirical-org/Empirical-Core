import { assert } from 'chai';
import {processSentence} from  './processSentence';
import {train} from './train';
import {
  correctSentence,
  removeSpecialCharsFromEnd,
  removeSpecialCharsFromStart,
  removeSpecialCharsFromWord
} from './correctSentence';

describe('The correct function', () => {

  it('Should take a sentence and correct it if appropriate.', () => {
    const correctAnswer = 'A really correct sentence.';
    const incorrectSentence = 'A realy correct sentence.';
    const dictionary = train(processSentence(correctAnswer));
    const output = correctSentence(dictionary, incorrectSentence);

    assert.equal(correctAnswer, output);
  });

});

describe('The string prep functions', () => {
  it('should be able to remove special chars from the start of a string', () => {
    assert.deepEqual(removeSpecialCharsFromStart('.a'), ['a', '.']);
    assert.deepEqual(removeSpecialCharsFromStart(',a'), ['a', ',']);
    assert.deepEqual(removeSpecialCharsFromStart('!a'), ['a', '!']);
    assert.deepEqual(removeSpecialCharsFromStart('?a'), ['a', '?']);
    assert.deepEqual(removeSpecialCharsFromStart('\"a'), ['a', '"']);
    assert.deepEqual(removeSpecialCharsFromStart('.,!?\"a'), ['a', '.,!?"']);
  });

  it('should be able to remove special chars from the end of a string', () => {
    assert.deepEqual(removeSpecialCharsFromEnd('a.'), ['a', '.']);
    assert.deepEqual(removeSpecialCharsFromEnd('a,'), ['a', ',']);
    assert.deepEqual(removeSpecialCharsFromEnd('a!'), ['a', '!']);
    assert.deepEqual(removeSpecialCharsFromEnd('a?'), ['a', '?']);
    assert.deepEqual(removeSpecialCharsFromEnd('a"'), ['a', '"']);
    assert.deepEqual(removeSpecialCharsFromEnd('a.,!?"'), ['a', '.,!?"']);
  });

  it('should be able to remove all special chars from both ends of the string.', () => {
    assert.deepEqual(removeSpecialCharsFromWord('"Ryan!?"'), ['"', 'Ryan', '!?"']);
    assert.deepEqual(removeSpecialCharsFromWord('!!!a'), ['!!!', 'a', '']);
    assert.deepEqual(removeSpecialCharsFromWord('""'), ['""', '', '']);
  });
});