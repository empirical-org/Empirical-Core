import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response} from '../../interfaces'

export function punctuationInsensitiveMatch(response: string, responses: Array<Response>) {
  return _.find(getOptimalResponses(responses),
    resp => removePunctuation(stringNormalize(resp.text)) === removePunctuation(stringNormalize(response))
  );
}

export function removePunctuation(string) {
  return string.replace(/[^A-Za-z0-9\s]/g, '');
}