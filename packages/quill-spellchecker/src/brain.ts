import { stringNormalize } from 'quill-string-normalizer'

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
  const normalizedDictString = stringNormalize(dictstring)
  const dictionary = train(normalizedDictString);

  return correctSentence(dictionary, sentence);
}
