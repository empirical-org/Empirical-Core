import * as _ from 'underscore'

import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, PartialResponse} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function caseStartMatch(responseString: string, responses:Array<Response>): Boolean {
  return (/^[a-z]/).test(responseString)
}

export function caseStartChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = caseStartMatch(responseString, responses);
  if (match) {
    return caseStartResponseBuilder(responses)
  }
}

export function caseStartResponseBuilder(responses:Array<Response>): PartialResponse {
  const res = {
    feedback: feedbackStrings.caseError,
    author: 'Capitalization Hint',
    parent_id: getTopOptimalResponse(responses).id,
    concept_results: [
      conceptResultTemplate('S76ceOpAWR-5m-k47nu6KQ')
    ],
  }
  return res
}
