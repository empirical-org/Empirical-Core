import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response} from '../../interfaces'

export function caseInsensitiveMatch(response: string, responses:Array<Response>):Response|undefined {
  return _.find(getOptimalResponses(responses),
    resp => stringNormalize(resp.text).toLowerCase() === stringNormalize(response).toLowerCase()
  );
}
