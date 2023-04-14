import expect from 'expect';
import quillNormalize from '../../libs/quillNormalizer.js';

String.prototype.quillNormalize = quillNormalize

describe('Replacing double quotation marks', () => {

  it('returns a sentence with normalized quotation marks', () => {
    const sentences = ['She said “that is not fair.”', 'She said ˝that is not fair.˝']
    const normalizedSentence = 'She said "that is not fair."'
    expect(sentences[0].quillNormalize()).toEqual(normalizedSentence);
    expect(sentences[1].quillNormalize()).toEqual(normalizedSentence);
  });
});

describe('Replacing single quotation marks', () => {
  const sentence = "She said ‘that is not fair.’"

  it('returns a sentence with normalized quotation marks', () => {
    const normalizedSentence = "She said 'that is not fair.'"
    expect(sentence.quillNormalize()).toEqual(normalizedSentence);
  });
});

describe('Replacing apostrophes', () => {
  const sentences = [
    "He wouldn´t go.",
    "He wouldn`t go.",
    "He wouldn´t go.",
    "He wouldnʻt go.",
    "He wouldnˈt go."
  ]
  const normalizedSentence = "He wouldn't go."

  it('returns a sentence with normalized apostrophes', () => {
    expect(sentences[0].quillNormalize()).toEqual(normalizedSentence);
  });

  it('returns a sentence with normalized apostrophes', () => {
    expect(sentences[1].quillNormalize()).toEqual(normalizedSentence);
  });

  it('returns a sentence with normalized apostrophes', () => {
    expect(sentences[2].quillNormalize()).toEqual(normalizedSentence);
  });

  it('returns a sentence with normalized apostrophes', () => {
    expect(sentences[3].quillNormalize()).toEqual(normalizedSentence);
  });

  it('returns a sentence with normalized apostrophes', () => {
    expect(sentences[4].quillNormalize()).toEqual(normalizedSentence);
  });
});

describe('Replacing commas', () => {
  const sentences = [
    "He said‚ she said.",
    "He saidˌ she said.",
    "He said， she said."
  ]
  const normalizedSentence = "He said, she said."

  it('returns a sentence with normalized apostrophes', () => {
    expect(sentences[0].quillNormalize()).toEqual(normalizedSentence);
  });

  it('returns a sentence with normalized apostrophes', () => {
    expect(sentences[1].quillNormalize()).toEqual(normalizedSentence);
  });

  it('returns a sentence with normalized apostrophes', () => {
    expect(sentences[2].quillNormalize()).toEqual(normalizedSentence);
  });
});
