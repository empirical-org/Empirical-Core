import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response} from '../../interfaces'

export function minLengthMatch(responseString:string, responses:Array<Response>):Response|undefined {
  const optimalResponses = getOptimalResponses(responses);
  if (optimalResponses.length < 2) {
    return undefined;
  }
  const lengthsOfResponses = optimalResponses.map(resp => stringNormalize(resp.text).split(' ').length);
  const minLength = _.min(lengthsOfResponses) - 1;
  if (responseString.split(' ').length < minLength) {
    return _.sortBy(optimalResponses, resp => stringNormalize(resp.text).length)[0];
  }
  return undefined;
}
