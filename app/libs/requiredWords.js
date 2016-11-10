import _ from 'underscore'
import {
  getPartsOfSpeechWordsWithTags
} from './partsOfSpeechTagging';


export function getCommonWords (sentences) {
  const words = _.map(sentences, (sentence) => {
     return normalizeString(sentence).split(" ")
   })
   return _.intersection(...words)
}

export function getMissingWords (userString, sentences) {
  const commonWords = getCommonWords(sentences);
  const wordsFromUser = normalizeString(userString).split(" ")
  return _.reject(commonWords, (commonWord) => {
    return _.contains(wordsFromUser, commonWord)
  })
}

export function getMissingWordsFromResponses (userString, responses) {
  const sentences = _.map(responses, (response) => response.text)
  return getMissingWords(userString, sentences)
}

function normalizeString (string) {
  return string.replace(/[.,?!]/g, "")
}
