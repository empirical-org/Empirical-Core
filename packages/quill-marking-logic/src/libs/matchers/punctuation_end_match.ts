import * as _ from 'underscore'

import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {Response, PartialResponse} from '../../interfaces'

export function punctuationEndMatch(responseString: string, responses:Array<Response>): Boolean {
  const lastChar = responseString[responseString.length - 1];
  return !!(lastChar && lastChar.match(/[a-z]/i));
}

export function punctuationEndChecker(responseString: string, responses:Array<Response>, markOptimalFalse:Boolean=false):PartialResponse|undefined {
  const match = punctuationEndMatch(responseString, responses);
  if (match) {
    return punctuationEndResponseBuilder(responses, markOptimalFalse)
  }
}

export function punctuationEndResponseBuilder(responses:Array<Response>, markOptimalFalse:Boolean): PartialResponse {
  const res:PartialResponse = {
    feedback: feedbackStrings.punctuationEndError,
    author: 'Punctuation End Hint',
    parent_id: getTopOptimalResponse(responses).id,
    concept_results: [
      conceptResultTemplate('68mWURj5PUdSICATQay8uA')
    ],
  }
  if (markOptimalFalse) {
    res.optimal = false
  }
  return res
}
