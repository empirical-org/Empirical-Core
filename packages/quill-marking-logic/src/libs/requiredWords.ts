import * as _ from 'underscore';

// import {
//   getPartsOfSpeechWordsWithTags
// } from './partsOfSpeechTagging';
import {stringNormalize} from 'quill-string-normalizer'

import {Response, FeedbackObject} from '../interfaces/index'

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

export function getCommonWords(sentences: Array<string>):Array<string> {
  const words = _.map(sentences, sentence => normalizeString(sentence).split(' '));
  return _.intersection(...words);
}

export function getCommonWordsWithImportantPOS(sentences: Array<string>):Array<string> {
  const allCommonWords = getCommonWords(sentences);
  return allCommonWords;
}

export function getMissingWords(userString: string, sentences: Array<string>):Array<string> {
  const commonWords = getCommonWordsWithImportantPOS(sentences);
  const wordsFromUser = normalizeString(userString).split(' ');
  return _.reject(commonWords, commonWord => _.contains(wordsFromUser, commonWord));
}

function _getCaseSensitiveWord(word: string, optimalSentences: Array<string>):string {
  const optimalSentence = optimalSentences[0]
  const normalizedString = removePunctuation(optimalSentence);
  const normalizedStringPlusLower = normalizeString(optimalSentence);
  const startIndex = normalizedStringPlusLower.indexOf(word);
  const normalizedWord = normalizedString.substring(startIndex, word.length + startIndex);
  if (normalizedWord != word) {
    return lowercaseNormalizedWordIfPossible(normalizedWord, word, optimalSentences)
  }
  return normalizedWord
}

function lowercaseNormalizedWordIfPossible(normalizedWord: string, originalWord:string, optimalSentences: Array<string>):string {
  const optimalWords = _.map(optimalSentences, sentence => normalizeStringWithoutLowercasing(sentence).split(' '));
  if ([].concat.apply([], optimalWords).indexOf(originalWord) != -1) {
    return originalWord
  }
  return normalizedWord
}

export function getFeedbackForWord(word: string, sentences:Array<string>, isSentenceFragment:Boolean):string {
  if (isSentenceFragment) {
    return `<p>Revise your work. Use all the words from the prompt, and make it complete by adding to it.</p>`;
  }
  const caseSensitiveWord = _getCaseSensitiveWord(word, sentences);
  return `<p>Revise your sentence to include the word <em>${caseSensitiveWord}</em>. You may have misspelled it.</p>`;
}

export function extractSentencesFromResponses(responses:Array<Response>):Array<string> {
  return responses.map(response => response.text);
}

export function getMissingWordsFromResponses(userString:string, sentences:Array<string>):Array<string> {
  const missingWords = getMissingWords(userString, sentences);
  return _.sortBy(missingWords, word => word.length).reverse();
}

export function checkForMissingWords(userString:string, responses:Array<Response>, isSentenceFragment:boolean = false):FeedbackObject {
  const sentences = extractSentencesFromResponses(responses);
  const missingWords = getMissingWordsFromResponses(userString, sentences);
  if (missingWords.length > 0) {
    return { feedback: getFeedbackForWord(missingWords[0], sentences, isSentenceFragment), };
  }
}

function normalizeString(string:string = ''):string {
  return stringNormalize(string).replace(/[.,?!;]/g, '').toLowerCase();
}

function removePunctuation(string:string = ''):string {
  return string.replace(/[.,?!;]/g, '');
}

function normalizeStringWithoutLowercasing(string:string=''):string {
  return stringNormalize(string).replace(/[.,?!;]/g, '');
}
