import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response} from '../../interfaces'

export function maxLengthMatch(responseString:string, responses:Array<Response>) {
  const optimalResponses = getOptimalResponses(responses);
  if (optimalResponses.length < 2) {
    return undefined;
  }
  const lengthsOfResponses = optimalResponses.map(resp => stringNormalize(resp.text).split(' ').length);
  const maxLength = _.max(lengthsOfResponses) + 1;
  if (responseString.split(' ').length > maxLength) {
    return _.sortBy(optimalResponses, resp => stringNormalize(resp.text).length).reverse()[0];
  }
  return undefined;
}
