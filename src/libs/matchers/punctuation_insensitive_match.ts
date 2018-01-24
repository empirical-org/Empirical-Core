import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response, PartialResponse} from '../../interfaces'
import constants from '../../constants'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {removePunctuation} from '../helpers/remove_punctuation'

export function punctuationInsensitiveMatch(responseString: string, responses: Array<Response>):Response|undefined {
  return _.find(getOptimalResponses(responses),
    resp => removePunctuation(stringNormalize(resp.text)) === removePunctuation(stringNormalize(responseString))
  );
}

export function punctuationInsensitiveChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = punctuationInsensitiveMatch(responseString, responses);
  if (match) {
    const parentID = match.id
    return punctuationInsensitiveResponseBuilder(responses, parentID)
  }
}

export function punctuationInsensitiveResponseBuilder(responses:Array<Response>, parentID:string|number): PartialResponse {
  const res = {
    feedback: constants.FEEDBACK_STRINGS.punctuationError,
    author: 'Punctuation Hint',
    parent_id: parentID,
    concept_results: [
      conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
    ]
  }
  return res
}
