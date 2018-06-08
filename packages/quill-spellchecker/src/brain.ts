import {processSentences} from  './processSentences';
import {train} from './train';
import common from './mostCommonWords';
import {
  correctSentence,
} from './correctSentence';

export function correctSentenceFromSamples(samples: string[], sentence: string, useCommon?: Boolean): string {
  let dictstring = processSentences(samples);
  if (useCommon) {
    dictstring = dictstring + "\n" + common;
  }
  const dictionary = train(dictstring);
  
  return correctSentence(dictionary, sentence);
}