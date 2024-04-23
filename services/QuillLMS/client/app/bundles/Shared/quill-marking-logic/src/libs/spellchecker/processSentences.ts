import {processSentence} from './processSentence';

/**
 * Takes an array of sentences and returns a \n separated string of words.
 * @param sentences - An array of strings that represent valid sentences.
 */
export function processSentences(sentences: string[]): string {
  return sentences
    .map(sentence => processSentence(sentence)) // process the individual sentences
    .filter(sentence => sentence !== '') // remove empty strings
    .join('\n'); // join the remaining strings
}

export function uniqueWordsFromSentences(sentences: string[]): string[] {
  const nestedWords = sentences
    .map(sentence => processSentence(sentence).split('\n')) // process the individual sentences
    .filter(sentence => sentence !== [] || sentence !== ['']); // remove empty arrays

  const flattenedWords: string[] = [].concat.apply([], nestedWords); // flatten the arrays

  return flattenedWords.filter(function(item, pos){
    return flattenedWords.indexOf(item) === pos; // remove the word if its position is not the first appearance in the array.
  });
}