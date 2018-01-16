import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'
import {getOptimalResponses} from '../sharedResponseFunctions'

export function punctuationInsensitiveMatch(response, responses) {
  return _.find(getOptimalResponses(responses),
    resp => removePunctuation(stringNormalize(resp.text)) === removePunctuation(stringNormalize(response))
  );
}

export function removePunctuation(string) {
  return string.replace(/[^A-Za-z0-9\s]/g, '');
}