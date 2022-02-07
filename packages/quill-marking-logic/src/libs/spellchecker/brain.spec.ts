import { assert } from 'chai';
import {correctSentenceFromSamples} from './brain';

describe('It should work for connect', () => {
  
  it('Should take a sentence and sample of one and return a corrected sentence.', () => {
    const sentences = ['A really correct sentence.'];
    const incorrectSentence = 'A realy correct sentence.';
    const output = correctSentenceFromSamples(sentences, incorrectSentence);
  
    assert.equal(output, sentences[0]);
  });

  it('Should take a sentence and multiple samples and return a corrected sentence.', () => {
    const sentences = ['A really correct sentence.', 'A perfectly correct sentence.'];
    const incorrectSentence = 'A realy perfecty correct sentence.';
    const output = correctSentenceFromSamples(sentences, incorrectSentence);
  
    assert.equal(output, "A really perfectly correct sentence.");
  });

  it('Should take a sentence and multiple samples and the common words and return a corrected sentence.', () => {
    const sentences = ['A really correct sentence.', 'A perfectly correct sentence.'];
    const incorrectSentence = 'A realy perfecty sntence.';
    const output = correctSentenceFromSamples(sentences, incorrectSentence, true);
  
    assert.equal(output, "A really perfectly sentence.");
  });

  it('Should take a sentence and multiple samples and the common words and return a corrected sentence.', () => {
    const sentences = ['A really correct sentence.', 'A perfectly correct sentence.'];
    const incorrectSentence = 'A realy perfecty god sntence.';
    const output = correctSentenceFromSamples(sentences, incorrectSentence, true);
  
    assert.equal(output, "A really perfectly good sentence.");
  });

});