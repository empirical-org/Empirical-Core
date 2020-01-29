import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'
import {Response} from '../../interfaces'

export function exactMatch(responseString:string, responses:Array<Response>, caseSensitive:Boolean=true):Response|undefined {
  if (caseSensitive) {
    return _.find(responses,
      resp => stringNormalize(resp.text) === stringNormalize(responseString)
    );
  } else {
      return _.find(responses,
      resp => stringNormalize(resp.text).toLowerCase() === stringNormalize(responseString).toLowerCase()
    );
  }
}
