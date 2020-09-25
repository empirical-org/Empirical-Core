import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'

import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response, PartialResponse} from '../../interfaces'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {feedbackStrings} from '../constants/feedback_strings'

const EXTRA_WHITESPACE_ERROR = 1
const MISSING_WHITESPACE_ERROR = 2

export function whitespaceMatch (response:string, responses: Array<Response>): Response|undefined {
  return _.find(getOptimalResponses(responses),
    resp => removeSpaces(stringNormalize(response)) === removeSpaces(stringNormalize(resp.text))
  );
}

const removeSpaces: (string: string) => string = string => string.replace(/\s+/g, '');

const countSpaces: (string: string) => number = string => string.split(/(\s)/).length - 1

export function whitespaceChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = whitespaceMatch(responseString, responses);
  if (match) {
    const parent_id = match.id
    if (countSpaces(match.text) > countSpaces(responseString)) {
      return whitespaceResponseBuilder(responses, parent_id, MISSING_WHITESPACE_ERROR)
    }
    return whitespaceResponseBuilder(responses, parent_id, EXTRA_WHITESPACE_ERROR)
  }
}

export function whitespaceResponseBuilder(responses:Array<Response>, parent_id: string|number, errorType: number): PartialResponse {
  const res = {
    feedback: errorType === EXTRA_WHITESPACE_ERROR ? feedbackStrings.extraWhitespaceError : feedbackStrings.missingWhitespaceError,
    author: 'Whitespace Hint',
    parent_id,
    concept_results: [
      conceptResultTemplate('5Yv4-kNHwwCO2p8HI90oqQ')
    ]
  }
  return res
}
