import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'

export function exactMatch(response, responses) {
  console.log(_)
  return _.find(responses,
    resp => stringNormalize(resp.text) === stringNormalize(response)
  );
}
