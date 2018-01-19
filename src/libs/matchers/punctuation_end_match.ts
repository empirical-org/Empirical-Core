import * as _ from 'underscore'
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, PartialResponse} from '../../interfaces'
import constants from '../../constants'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function punctuationEndMatch(responseString: string, responses:Array<Response>): Boolean {
  const lastChar = responseString[responseString.length - 1];
  return !!(lastChar && lastChar.match(/[a-z]/i));
}

export function punctuationEndChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = punctuationEndMatch(responseString, responses);
  if (match) {
    return punctuationEndResponseBuilder(responses)
  }
}

export function punctuationEndResponseBuilder(responses:Array<Response>): PartialResponse {
  const res = {
    feedback: constants.FEEDBACK_STRINGS.punctuationError,
    author: 'Punctuation End Hint',
    parent_id: getTopOptimalResponse(responses).id,
    concept_results: [
      conceptResultTemplate('JVJhNIHGZLbHF6LYw605XA')
    ],
  }
  return res
}
