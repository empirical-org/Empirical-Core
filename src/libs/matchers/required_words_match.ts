import * as _ from 'underscore'
import {checkForMissingWords} from '../requiredWords'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response} from '../../interfaces'

export function requiredWordsMatch(responseString: string, responses:Array<Response>) {
  return checkForMissingWords(responseString, getOptimalResponses(responses));
}
