import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response} from '../../interfaces'

export function punctuationAndCaseInsensitiveMatch(responseString:string, responses:Array<Response>) {
  return _.find(getOptimalResponses(responses), (resp) => {
    const supplied = removePunctuation(stringNormalize(responseString)).toLowerCase();
    const target = removePunctuation(stringNormalize(resp.text)).toLowerCase();
    return supplied === target;
  });
}

export function removePunctuation(string) {
  return string.replace(/[^A-Za-z0-9\s]/g, '');
}
