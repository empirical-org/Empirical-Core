import * as _ from 'underscore'
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response} from '../../interfaces'

export function punctuationEndMatch(responseString:string, responses:Array<Response>) {
  const lastChar = responseString[responseString.length - 1];
  if (lastChar && lastChar.match(/[a-z]/i)) {
    return getTopOptimalResponse(responses);
  }
}
