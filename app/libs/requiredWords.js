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

function normalizeString (string) {
  return string.replace(/[.,?!]/g, "")
}
