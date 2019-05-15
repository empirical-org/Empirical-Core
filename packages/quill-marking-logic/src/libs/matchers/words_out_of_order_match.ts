import * as _ from 'underscore'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {stringNormalize} from 'quill-string-normalizer'
import {Response, PartialResponse} from '../../interfaces'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {feedbackStrings} from '../constants/feedback_strings'

export function wordsOutOfOrderMatch (response:string, responses: Array<Response>): Response|undefined {
  return _.find(getOptimalResponses(responses),
    resp => identicalWordMaps(mapWordCounts(stringNormalize(response)), mapWordCounts(stringNormalize(resp.text)))
  );
}

function mapWordCounts(sentenceString: string): Object {
  const wordsArray = sentenceString.split(' ');
  return wordsArray.reduce((wordMap, word) => {
    if (!wordMap[word]) wordMap[word] = 0;
    wordMap[word]++;
    return wordMap;
  }, {});
}

function identicalWordMaps(wordMap1: object, wordMap2: object): boolean {
  const keys1 = Object.keys(wordMap1);
  const keys2 = Object.keys(wordMap2);
  if (keys1.length !== keys2.length) return false;
  return keys1.every((key) => wordMap1[key] === wordMap2[key]);
}

export function wordsOutOfOrderChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = wordsOutOfOrderMatch(responseString, responses);
  if (match) {
    const parent_id = match.id
    return wordsOutOfOrderResponseBuilder(responses, parent_id)
  }
}

export function wordsOutOfOrderResponseBuilder(responses:Array<Response>, parent_id: string|number): PartialResponse {
  const res = {
    feedback: feedbackStrings.wordsOutOfOrderError,
    author: 'Words Out of Order Hint',
    parent_id,
    concept_results: [
      conceptResultTemplate('5Yv4-kNHwwCO2p8HI90oqQ')
    ]
  }
  return res
}

