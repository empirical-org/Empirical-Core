import _ from 'underscore';
import {
    getPartsOfSpeechWordsWithTags
} from './partsOfSpeechTagging';

const posTranslations = {
  JJ: 'Adjective',
  JJR: 'Adjective',
  JJS: 'Adjective',

  RB: 'Adverb',
  RBR: 'Adverb',
  RBS: 'Adverb',
  WRB: 'Adverb',

  CC: 'Conjunction',

  NN: 'Noun',
  NNP: 'Noun',
  NNPS: 'Noun',
  NNS: 'Noun',

  CD: 'Number',
  LS: 'Number',

  IN: 'Preposition',

  PP$: 'Pronoun',
  PRP: 'Pronoun',
  WP: 'Pronoun',
  WP$: 'Pronoun',

  VB: 'Verb',
  VBD: 'Verb',
  VBG: 'Verb',
  VBN: 'Verb',
  VBP: 'Verb',
  VBZ: 'Verb',
};

const posConceptResults = {
  Adjective: 'placeholder',
  Adverb: 'placeholder',
  Conjunction: 'placeholder',
  Noun: 'placeholder',
  Number: 'placeholder',
  Preposition: 'placeholder',
  Pronoun: 'placeholder',
  Verb: 'placeholder',
};

export function getCommonWords(sentences) {
  const words = _.map(sentences, (sentence) => normalizeString(sentence).split(' '));
  return _.intersection(...words);
}

export function getCommonWordsWithimportantPOS(sentences) {
  const allCommonWords = getCommonWords(sentences);
  return _.reject(allCommonWords, (word) => {
    if (getPartsOfSpeechWordsWithTags(word) && getPartsOfSpeechWordsWithTags(word)[0]) {
      const tag = getPartsOfSpeechWordsWithTags(word)[0][1];
      return !posTranslations[tag];
    }
    return true;
  });
}

export function getMissingWords(userString, sentences) {
  const commonWords = getCommonWordsWithimportantPOS(sentences);
  const wordsFromUser = normalizeString(userString).split(' ');
  return _.reject(commonWords, commonWord => _.contains(wordsFromUser, commonWord));
}

export function getPOSForWord(word) {
  const tag = getPartsOfSpeechWordsWithTags(word)[0][1];
  return posTranslations[tag];
}

function _getCaseSensitiveWord(word, optimalSentence) {
  const normalizedString = removePunctuation(optimalSentence);
  const normalizedStringPlusLower = normalizeString(optimalSentence);
  const startIndex = normalizedStringPlusLower.indexOf(word);
  return normalizedString.substring(startIndex, word.length + startIndex);
}

export function getFeedbackForWord(word, sentences, isSentenceFragment) {
  // const tag = getPOSForWord(word).toLowerCase();
  if (isSentenceFragment) {
    return '<p>Revise your work. Use all the words from the prompt, and make it complete by adding to it.</p>';
  }
  const caseSensitiveWord = _getCaseSensitiveWord(word, sentences[0]);
  return `<p>Revise your sentence to include the word <em>${caseSensitiveWord}</em>. You may have misspelled it.</p>`;
}

export function extractSentencesFromResponses(responses) {
  return _.map(responses, response => response.text);
}

export function getMissingWordsFromResponses(userString, sentences) {
  const missingWords = getMissingWords(userString, sentences);
  return _.sortBy(missingWords, word => word.length).reverse();
}

export function checkForMissingWords(userString, responses, isSentenceFragment = false) {
  const sentences = extractSentencesFromResponses(responses);
  const missingWords = getMissingWordsFromResponses(userString, sentences);
  if (missingWords.length > 0) {
    return { feedback: getFeedbackForWord(missingWords[0], sentences, isSentenceFragment), };
  }
}

function normalizeString(string = '') {
  return string.replace(/[.,?!;]/g, '').toLowerCase();
}

function removePunctuation(string = '') {
  return string.replace(/[.,?!;"()]/g, '');
}
