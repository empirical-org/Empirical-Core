import expect from 'expect';
import quillNormalize from '../../app/libs/quillNormalizer'

describe('Replacing double quotation marks', () => {
  const sentence = 'She said “that is not fair.”'

  it('returns a sentence with normalized quotation marks', () => {
    const normalizedSentence = 'She said "that is not fair."'
    expect(sentence.quillNormalize()).toEqual(normalizedSentence);
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
  const sentences = ["He wouldn´t go.", "He wouldn`t go."]
  const normalizedSentence = "He wouldn't go."

  it('returns a sentence with normalized apostrophes', () => {
    expect(sentences[0].quillNormalize()).toEqual(normalizedSentence);
  });

  it('returns a sentence with normalized apostrophes', () => {
    expect(sentences[1].quillNormalize()).toEqual(normalizedSentence);
  });
});

describe('Replacing commas', () => {
  const sentence = "He said‚ she said."
  const normalizedSentence = "He said, she said."

  it('returns a sentence with normalized apostrophes', () => {
    expect(sentence.quillNormalize()).toEqual(normalizedSentence);
  });

});
