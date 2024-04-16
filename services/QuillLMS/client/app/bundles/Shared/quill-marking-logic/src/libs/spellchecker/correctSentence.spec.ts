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

    expect(correctAnswer).toEqual(output);
  });

});

describe('The string prep functions', () => {
  it('should be able to remove special chars from the start of a string', () => {
    expect(removeSpecialCharsFromStart('.a')).toEqual(['a', '.']);
    expect(removeSpecialCharsFromStart(',a')).toEqual(['a', ',']);
    expect(removeSpecialCharsFromStart('!a')).toEqual(['a', '!']);
    expect(removeSpecialCharsFromStart('?a')).toEqual(['a', '?']);
    expect(removeSpecialCharsFromStart('\"a')).toEqual(['a', '"']);
    expect(removeSpecialCharsFromStart('.,!?\"a')).toEqual(['a', '.,!?"'])
  });

  it('should be able to remove special chars from the end of a string', () => {
    expect(removeSpecialCharsFromEnd('a.')).toEqual(['a', '.']);
    expect(removeSpecialCharsFromEnd('a,')).toEqual(['a', ',']);
    expect(removeSpecialCharsFromEnd('a!')).toEqual(['a', '!']);
    expect(removeSpecialCharsFromEnd('a?')).toEqual(['a', '?']);
    expect(removeSpecialCharsFromEnd('a"')).toEqual(['a', '"']);
    expect(removeSpecialCharsFromEnd('a.,!?"')).toEqual(['a', '.,!?"']);
  });

  it('should be able to remove all special chars from both ends of the string.', () => {
    expect(removeSpecialCharsFromWord('"Ryan!?"')).toEqual(['"', 'Ryan', '!?"']);
    expect(removeSpecialCharsFromWord('!!!a')).toEqual(['!!!', 'a', '']);
    expect(removeSpecialCharsFromWord('""')).toEqual(['""', '', '']);
  });
});
