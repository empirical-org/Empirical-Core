import expect from 'expect';
import {
  getCommonWords,
  getCommonWordsWithImportantPOS,
  getMissingWords,
  getMissingWordsFromResponses,
  getPOSForWord,
  getFeedbackForWord,
  extractSentencesFromResponses
} from '../../app/libs/requiredWords';
import {
  getPartsOfSpeechWordsWithTags,
  checkPOSEquivalancy
} from '../../app/libs/partsOfSpeechTagging';

describe('Finding the common words in multiple sentences', () => {
  const sentences = [
    'Bob and Sally went to the park.',
    'Bob and Sally both went to the park.'
  ];

  it('returns change objects', () => {
    const expected = [
      'bob',
      'and',
      'sally',
      'went',
      'to',
      'the',
      'park'
    ];
    console.log('Expected: ', expected);
    console.log('Gen: ', getCommonWords(sentences));
    expect(getCommonWords(sentences)).toEqual(expected);
  });
});

describe('Finding the common words in multiple sentences, taking capitalisation into account', () => {
  const sentences = [
    'Bob and Sally then went to the park.',
    'Then Bob and Sally went to the park.'
  ];

  it('returns the appropriate POS', () => {
    const expected = [
      'bob',
      'and',
      'sally',
      'then',
      'went',
      'to',
      'the',
      'park'
    ];
    expect(getCommonWords(sentences)).toEqual(expected);
  });
});

describe('Finding the common words in multiple sentences, taking only important POS into account', () => {
  const sentences = [
    'Bob and Sally then went to the park.',
    'Then Bob and Sally went to the park.'
  ];

  it('returns the appropriate POS', () => {
    const expected = [
      'bob',
      'and',
      'sally',
      'then',
      'went',
      'park'
    ];
    expect(getCommonWordsWithImportantPOS(sentences)).toEqual(expected);
  });
});

describe('Detecting if a string is missing a required word', () => {
  const sentences = [
    'Bob and Sally then went to the park.',
    'Then Bob and Sally went to the park.'
  ];

  it("knows when a user hasn't missed any words", () => {
    const user = 'Then Bob and Sally both went to the park.';
    const expected = [];
    expect(getMissingWords(user, sentences)).toEqual(expected);
  });

  it('knows when a user has missed a word', () => {
    const user = 'Then Bob and Stephanie both went to the park.';
    const expected = ['sally'];
    expect(getMissingWords(user, sentences)).toEqual(expected);
  });

  it('knows when a user has missed multiple words', () => {
    const user = 'Then they both went to the park.';
    const expected = ['bob', 'and', 'sally'];
    expect(getMissingWords(user, sentences)).toEqual(expected);
  });
});

describe('Finding the common words in multiple sentences', () => {
  const responses = [
    {
      text: 'The woman in the next room is the teacher.',
      feedback: "Excellent, that's correct!",
      optimal: true,
      key: 1,
    },
    {
      text: 'The female teacher is in the next room.',
      feedback: 'How do you refer to one specific teacher?',
      optimal: true,
      key: 2,
    },
    {
      text: 'The teacher is the woman in the next room.',
      feedback: 'How do you refer to one specific teacher?',
      optimal: true,
      key: 3,
    }
  ];
  const user = 'The woman in the room is the teacher.';

  it('returns the common missing words', () => {
    const expected = [
      'next'
    ];
    expect(getMissingWordsFromResponses(user, extractSentencesFromResponses(responses))).toEqual(expected);
  });

  it('returns the correct POS for the first missing word.', () => {
    const expected = 'Adjective';
    const missingWords = getMissingWordsFromResponses(user, extractSentencesFromResponses(responses));
    const posLabel = getPOSForWord(missingWords[0]);
    expect(posLabel).toEqual(expected);
  });

  it('returns the correct feedback string for the first missing word.', () => {
    const expected = '<p>Revise your sentence to include the word <em>next</em>. You may have misspelled it.</p>';
    const sentences = extractSentencesFromResponses(responses);
    const missingWords = getMissingWordsFromResponses(user, sentences);
    console.log('Miss words, ', missingWords[0]);
    const feedback = getFeedbackForWord(missingWords[0], sentences);
    expect(feedback).toEqual(expected);
  });

  it('returns the ignores semi colons when splitting words', () => {
    const expected = [
    ];
    const userSemi = 'The woman in the next; room is the teacher.';
    expect(getMissingWordsFromResponses(userSemi, extractSentencesFromResponses(responses))).toEqual(expected);
  });
});
