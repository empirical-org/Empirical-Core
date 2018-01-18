import * as _ from 'underscore'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {stringNormalize} from 'quill-string-normalizer'
import {Response} from '../../interfaces'

export function whitespaceMatch (response:string, responses: Array<Response>): Response|undefined {
  return _.find(getOptimalResponses(responses),
    resp => removeSpaces(stringNormalize(response)) === removeSpaces(stringNormalize(resp.text))
  );
}

const removeSpaces: (string: string) => string = string => string.replace(/\s+/g, '');
