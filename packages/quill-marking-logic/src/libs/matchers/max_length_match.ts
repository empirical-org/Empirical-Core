import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'

import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response, PartialResponse} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function maxLengthMatch(responseString:string, responses:Array<Response>):Boolean {
  const optimalResponses = getOptimalResponses(responses);
  if (optimalResponses.length < 2) {
    return false;
  }
  const lengthsOfResponses = optimalResponses.map(resp => stringNormalize(resp.text).split(' ').length);
  const maxLength = _.max(lengthsOfResponses) + 1;
  return responseString.split(' ').length > maxLength
}

export function maxLengthChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = maxLengthMatch(responseString, responses);
  if (match) {
    return maxLengthResponseBuilder(responses)
  }
}

export function maxLengthResponseBuilder(responses:Array<Response>): PartialResponse {
  const optimalResponses = getOptimalResponses(responses);
  const longestOptimalResponse = _.sortBy(optimalResponses, resp => stringNormalize(resp.text).length).reverse()[0];
  const res = {
    feedback: feedbackStrings.maxLengthError,
    author: 'Not Concise Hint',
    parent_id: longestOptimalResponse.key,
    concept_results: [
      conceptResultTemplate('QYHg1tpDghy5AHWpsIodAg')
    ]
  }
  return res
}
