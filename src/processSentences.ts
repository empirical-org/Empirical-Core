import {processSentence} from './processSentence';

export function processSentences(sentences: string[]): string {
  return sentences
    .map(sentence => processSentence(sentence)) // process the individual sentences
    .filter(sentence => sentence !== '') // remove empty strings
    .join('\n'); // join the remaining strings
}