import * as _ from 'underscore'
import {checkForMissingWords} from '../requiredWords'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response, FeedbackObject} from '../../interfaces'

export function requiredWordsMatch(responseString: string, responses:Array<Response>):FeedbackObject {
  return checkForMissingWords(responseString, getOptimalResponses(responses));
}
