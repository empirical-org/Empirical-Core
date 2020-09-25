import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'

import {checkForMissingWords} from '../requiredWords'
import {getOptimalResponses, getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, FeedbackObject, PartialResponse} from '../../interfaces'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function requiredWordsMatch(responseString: string, responses:Array<Response>):FeedbackObject {
  return checkForMissingWords(stringNormalize(responseString), getOptimalResponses(responses));
}

export function requiredWordsChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = requiredWordsMatch(responseString, responses);
  if (match) {
    const feedback = match.feedback
    return requiredWordsResponseBuilder(responses, feedback)
  }
}

export function requiredWordsResponseBuilder(responses:Array<Response>, feedback:string): PartialResponse {
  const res = {
    feedback,
    author: 'Required Words Hint',
    parent_id: getTopOptimalResponse(responses).id,
    concept_results: [
      conceptResultTemplate('N5VXCdTAs91gP46gATuvPQ')
    ]
  }
  return res
}
