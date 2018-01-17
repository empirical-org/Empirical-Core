import * as _ from 'underscore'
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response} from '../../interfaces'

export function caseStartMatch(responseString: string, responses:Array<Response>) {
  if ((/^[a-z]/).test(responseString)) {
    return getTopOptimalResponse(responses);
  }
}
