import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'
import {Response} from '../../interfaces'

export function exactMatch(responseString:string, responses:Array<Response>) {
  console.log(_)
  return _.find(responses,
    resp => stringNormalize(resp.text) === stringNormalize(responseString)
  );
}
