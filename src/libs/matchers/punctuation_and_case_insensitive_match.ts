import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response, PartialResponse} from '../../interfaces'
import constants from '../../constants'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function punctuationAndCaseInsensitiveMatch(responseString:string, responses:Array<Response>):Response|undefined {
  return _.find(getOptimalResponses(responses), (resp) => {
    const supplied = removePunctuation(stringNormalize(responseString)).toLowerCase();
    const target = removePunctuation(stringNormalize(resp.text)).toLowerCase();
    return supplied === target;
  });
}

export function removePunctuation(string) {
  return string.replace(/[^A-Za-z0-9\s]/g, '');
}

export function punctuationAndCaseInsensitiveChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = punctuationAndCaseInsensitiveMatch(responseString, responses);
  if (match) {
    const parentID = match.key
    return punctuationAndCaseInsensitiveResponseBuilder(responses, parentID)
  }
}

export function punctuationAndCaseInsensitiveResponseBuilder(responses:Array<Response>, parentID:string|number): PartialResponse {
  const res = {
    feedback: constants.FEEDBACK_STRINGS.punctuationAndCaseError,
    author: 'Punctuation and Case Hint',
    parent_id: parentID,
    concept_results: [
      conceptResultTemplate('66upe3S5uvqxuHoHOt4PcQ'),
      conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
    ]
  }
  return res
}
