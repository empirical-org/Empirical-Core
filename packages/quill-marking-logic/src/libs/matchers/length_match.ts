import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'

import constants from '../../constants';
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, PartialResponse, ConceptResult, WordCountChange} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export interface LengthMatch {
  feedback: string,
  author: string
}

export function lengthMatch(response: string, responses:Array<Response>, prompt:string, wordCountChange:WordCountChange={}):LengthMatch|undefined {
  const userWordCount = wordLengthCount(response);
  const promptWordCount = wordLengthCount(prompt);
  const maxWordCount = promptWordCount + wordCountChange.max;
  const minWordCount = promptWordCount + wordCountChange.min;
  const feedback = getMinMaxFeedback(wordCountChange.min, wordCountChange.max);
  if (wordCountChange.min && (userWordCount < minWordCount)) {
    return {
      feedback,
      author: 'Too Short Hint',
    };
  } else if (wordCountChange.max && (userWordCount > maxWordCount)) {
    return {
      feedback,
      author: 'Too Long Hint',
    };
  }
}

export function lengthChecker(responseString: string, responses:Array<Response>, prompt: string, wordCountChange:Object={}):PartialResponse|undefined {
  const match = lengthMatch(responseString, responses, prompt, wordCountChange);
  if (match) {
    const parentID = getTopOptimalResponse(responses).id
    return lengthResponseBuilder(responses, parentID, match.author, match.feedback)
  }
}

export function lengthResponseBuilder(responses:Array<Response>, parentID:string|number, author: string, feedback: string): PartialResponse {
  const res = {
    optimal: false,
    parent_id: parentID,
    author,
    feedback
  }
  return res
}

export function wordLengthCount(str) {
  const strNoPunctuation = str.replace(/[^0-9a-z\s]/gi, '').replace(/\s{2,}/g, ' ').split(' ');
  return strNoPunctuation.length;
}

export function getMinMaxFeedback(min, max) {
  if (min === max) {
    if (min === 1) {
      return 'Revise your work. Add one word to the prompt to make the sentence complete.';
    }
    return `Revise your work. Add ${constants.NUMBERS_AS_WORDS[min]} words to the prompt to make the sentence complete.`;
  }
  return `Revise your work. Add ${constants.NUMBERS_AS_WORDS[min]} to ${constants.NUMBERS_AS_WORDS[max]} words to the prompt to make the sentence complete.`;
}
