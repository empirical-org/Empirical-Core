import * as _ from 'underscore'

import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {Response, PartialResponse} from '../../interfaces'

export function quotationMarkMatch(responseString: string, responses:Array<Response>): Boolean {
  return /''/.test(responseString);
}

export function quotationMarkChecker(responseString: string, responses:Array<Response>, markOptimalFalse:Boolean=false):PartialResponse|undefined {
  const match = quotationMarkMatch(responseString, responses);
  if (match) {
    return quotationMarkResponseBuilder(responses, markOptimalFalse)
  }
}

export function quotationMarkResponseBuilder(responses:Array<Response>, markOptimalFalse:Boolean): PartialResponse {
  const res:PartialResponse = {
    feedback: feedbackStrings.quotationMarkError,
    author: 'Quotation Mark Hint',
    parent_id: getTopOptimalResponse(responses).id,
    concept_results: [
      conceptResultTemplate('TWgxAwCxRjDLPzpZWYmGrw')
    ],
  }
  if (markOptimalFalse) {
    res.optimal = false
  }
  return res
}
