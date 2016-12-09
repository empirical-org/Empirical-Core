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
  const words = _.map(sentences, sentence => normalizeString(sentence).split(' '));
  return _.intersection(...words);
}

export function getCommonWordsWithImportantPOS(sentences) {
  const allCommonWords = getCommonWords(sentences);
  return _.reject(allCommonWords, (word) => {
    const tag = getPartsOfSpeechWordsWithTags(word)[0][1];
    return !posTranslations[tag];
  });
}

export function getMissingWords(userString, sentences) {
  const commonWords = getCommonWordsWithImportantPOS(sentences);
  const wordsFromUser = normalizeString(userString).split(' ');
  return _.reject(commonWords, commonWord => _.contains(wordsFromUser, commonWord));
}

export function getPOSForWord(word) {
  const tag = getPartsOfSpeechWordsWithTags(word)[0][1];
  return posTranslations[tag];
}

function _getCaseSensitiveWord(word, optimalSentence) {

}

export function getFeedbackForWord(word, sentences) {
  // const tag = getPOSForWord(word).toLowerCase();
  const caseSensitiveWord = _getCaseSensitiveWord(word, sentences[0]);
  return `<p>Revise your sentence to include the word <em>${word}</em>.</p>`;
}

function _extractSentencesFromResponses(responses) {
  return _.map(responses, response => response.text);
}

export function getMissingWordsFromResponses(userString, sentences) {
  return getMissingWords(userString, sentences);
}

export function checkForMissingWords(userString, responses) {
  const sentences = _extractSentencesFromResponses(responses);
  const missingWords = getMissingWordsFromResponses(userString, sentences);
  if (missingWords.length > 0) {
    return { feedback: getFeedbackForWord(missingWords[0], sentences), };
  }
}

function normalizeString(string) {
  return string.replace(/[.,?!]/g, '').toLowerCase();
}
