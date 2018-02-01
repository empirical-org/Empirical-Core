import * as _ from 'underscore'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {stringNormalize} from 'quill-string-normalizer'
import {Response, PartialResponse} from '../../interfaces'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {feedbackStrings} from '../constants/feedback_strings'

export function whitespaceMatch (response:string, responses: Array<Response>): Response|undefined {
  return _.find(getOptimalResponses(responses),
    resp => removeSpaces(stringNormalize(response)) === removeSpaces(stringNormalize(resp.text))
  );
}

const removeSpaces: (string: string) => string = string => string.replace(/\s+/g, '');

export function whitespaceChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = whitespaceMatch(responseString, responses);
  if (match) {
    const parent_id = match.id
    return whitespaceResponseBuilder(responses, parent_id)
  }
}

export function whitespaceResponseBuilder(responses:Array<Response>, parent_id: string|number): PartialResponse {
  const res = {
    feedback: feedbackStrings.whitespaceError,
    author: 'Whitespace Hint',
    parent_id,
    concept_results: [
      conceptResultTemplate('5Yv4-kNHwwCO2p8HI90oqQ')
    ]
  }
  return res
}
