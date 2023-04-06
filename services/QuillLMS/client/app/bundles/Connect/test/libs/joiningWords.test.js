import expect from 'expect';
import {
    getFeedbackForMissingWord
} from '../../libs/algorithms/joiningWords.js';

describe('Checking for feedback for missing words', () => {
  it('can get feedback when because is missing from a sentence', () => {
    const missingWord = 'because';
    const expected = 'Revise your work. Which joining word helps tell why or give a reason?';
    const generated = getFeedbackForMissingWord(missingWord);
    expect(generated).toEqual(expected);
  });

  it('can get feedback when because is missing from a sentence when white space is present at the beginning of the word', () => {
    const missingWord = ' because';
    const expected = 'Revise your work. Which joining word helps tell why or give a reason?';
    const generated = getFeedbackForMissingWord(missingWord);
    expect(generated).toEqual(expected);
  });

  it('can get feedback when because is missing from a sentence when white space is present at the end of the word', () => {
    const missingWord = 'because ';
    const expected = 'Revise your work. Which joining word helps tell why or give a reason?';
    const generated = getFeedbackForMissingWord(missingWord);
    expect(generated).toEqual(expected);
  });

  it('can get feedback when because is missing from a sentence when white space is present at the beginning and end of the word', () => {
    const missingWord = ' because ';
    const expected = 'Revise your work. Which joining word helps tell why or give a reason?';
    const generated = getFeedbackForMissingWord(missingWord);
    expect(generated).toEqual(expected);
  });

  it('can get feedback when because is missing from a sentence when capitalisation is different', () => {
    const missingWord = 'Because';
    const expected = 'Revise your work. Which joining word helps tell why or give a reason?';
    const generated = getFeedbackForMissingWord(missingWord);
    expect(generated).toEqual(expected);
  });
});
