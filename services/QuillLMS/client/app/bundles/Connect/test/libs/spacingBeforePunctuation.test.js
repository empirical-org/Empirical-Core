import expect from 'expect';
import {
    checkForSpacingError,
    getFeedbackForPunc,
    spacingBeforePunctuation
} from '../../libs/algorithms/spacingBeforePunctuation.js';

describe('Checking for a spacing issue before punctuation', () => {
  it('can detect commas with leading spaces', () => {
    const sentence = 'I really like jam , jelly , and marmalade .';
    const expected = ' ,';
    const generated = checkForSpacingError(sentence);
    expect(generated).toEqual(expected);
  });

  it('can detect full stops with leading spaces', () => {
    const sentence = 'I really like jam, jelly, and marmalade .';
    const expected = ' .';
    const generated = checkForSpacingError(sentence);
    expect(generated).toEqual(expected);
  });

  it('can detect question marks with leading spaces', () => {
    const sentence = 'The styling is wierd, did the javascript change ?';
    const expected = ' ?';
    const generated = checkForSpacingError(sentence);
    expect(generated).toEqual(expected);
  });

  it('can detect exclamation marks with leading spaces', () => {
    const sentence = 'Ruummmm----haaaaaaaammmmm !';
    const expected = ' !';
    const generated = checkForSpacingError(sentence);
    expect(generated).toEqual(expected);
  });

  it('can detect semi-colons with leading spaces', () => {
    const sentence = "But I must say I have a great respect for the semi-colon ; it's a useful little chap.";
    const expected = ' ;';
    const generated = checkForSpacingError(sentence);
    expect(generated).toEqual(expected);
  });
});

describe('Generating feedback for a spacing issue before punctuation', () => {
  it('can generate feedback for commas with leading spaces', () => {
    const match = ' ,';
    const expected = "<p>Revise your sentence. You don't need to have a space before a <em>comma</em>.</p>";
    const generated = getFeedbackForPunc(match);
    expect(generated).toEqual(expected);
  });

  it('can generate feedback for full stops with leading spaces', () => {
    const match = ' .';
    const expected = "<p>Revise your sentence. You don't need to have a space before a <em>period</em>.</p>";
    const generated = getFeedbackForPunc(match);
    expect(generated).toEqual(expected);
  });

  it('can generate feedback for question marks with leading spaces', () => {
    const match = ' ?';
    const expected = "<p>Revise your sentence. You don't need to have a space before a <em>question mark</em>.</p>";
    const generated = getFeedbackForPunc(match);
    expect(generated).toEqual(expected);
  });

  it('can generate feedback for exclamation marks with leading spaces', () => {
    const match = ' !';
    const expected = "<p>Revise your sentence. You don't need to have a space before a <em>exclamation mark</em>.</p>";
    const generated = getFeedbackForPunc(match);
    expect(generated).toEqual(expected);
  });

  it('can generate feedback for semi-colons with leading spaces', () => {
    const match = ' ;';
    const expected = "<p>Revise your sentence. You don't need to have a space before a <em>semi-colon</em>.</p>";
    const generated = getFeedbackForPunc(match);
    expect(generated).toEqual(expected);
  });
});

describe('Generating feedback object for a spacing issue before punctuation', () => {
  it('can generate a feedback object for commas with leading spaces', () => {
    const sentence = 'I really like jam , jelly , and marmalade .';
    const expected = { feedback: "<p>Revise your sentence. You don't need to have a space before a <em>comma</em>.</p>", };
    const generated = spacingBeforePunctuation(sentence);
    expect(generated).toEqual(expected);
  });

  it('can generate a feedback object for full stops with leading spaces', () => {
    const sentence = 'I really like jam, jelly, and marmalade .';
    const expected = { feedback: "<p>Revise your sentence. You don't need to have a space before a <em>period</em>.</p>", };
    const generated = spacingBeforePunctuation(sentence);
    expect(generated).toEqual(expected);
  });

  it('can generate a feedback object for question marks with leading spaces', () => {
    const sentence = 'The styling is wierd, did the javascript change ?';
    const expected = { feedback: "<p>Revise your sentence. You don't need to have a space before a <em>question mark</em>.</p>", };
    const generated = spacingBeforePunctuation(sentence);
    expect(generated).toEqual(expected);
  });

  it('can generate a feedback object for exclamation marks with leading spaces', () => {
    const sentence = 'Ruummmm----haaaaaaaammmmm !';
    const expected = { feedback: "<p>Revise your sentence. You don't need to have a space before a <em>exclamation mark</em>.</p>", };
    const generated = spacingBeforePunctuation(sentence);
    expect(generated).toEqual(expected);
  });

  it('can generate a feedback object for semi-colons with leading spaces', () => {
    const sentence = "But I must say I have a great respect for the semi-colon ; it's a useful little chap.";
    const expected = { feedback: "<p>Revise your sentence. You don't need to have a space before a <em>semi-colon</em>.</p>", };
    const generated = spacingBeforePunctuation(sentence);
    expect(generated).toEqual(expected);
  });
});
