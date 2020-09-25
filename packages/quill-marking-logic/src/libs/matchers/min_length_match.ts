import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'

import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response, PartialResponse} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function minLengthMatch(responseString:string, responses:Array<Response>):Boolean {
  const optimalResponses = getOptimalResponses(responses);
  if (optimalResponses.length < 2) {
    return undefined;
  }
  const lengthsOfResponses = optimalResponses.map(resp => stringNormalize(resp.text).split(' ').length);
  const minLength = _.min(lengthsOfResponses) - 1;
  return responseString.split(' ').length < minLength
}

export function minLengthChecker(responseString: string, responses:Array<Response>, noConceptResults:Boolean=false):PartialResponse|undefined {
  const match = minLengthMatch(responseString, responses);
  if (match) {
    return minLengthResponseBuilder(responses, noConceptResults)
  }
}

export function minLengthResponseBuilder(responses:Array<Response>, noConceptResults:Boolean): PartialResponse {
  const optimalResponses = getOptimalResponses(responses);
  const shortestOptimalResponse =  _.sortBy(optimalResponses, resp => stringNormalize(resp.text).length)[0];
  const res = {
    feedback: feedbackStrings.minLengthError,
    author: 'Missing Details Hint',
    parent_id: shortestOptimalResponse.key,
    concept_results: noConceptResults ? undefined : [
      conceptResultTemplate('N5VXCdTAs91gP46gATuvPQ')
    ]
  }
  return res
}
