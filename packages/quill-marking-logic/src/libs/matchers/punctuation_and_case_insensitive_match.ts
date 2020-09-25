import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'

import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response, PartialResponse, ConceptResult} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
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

export function punctuationAndCaseInsensitiveChecker(responseString: string, responses:Array<Response>, passConceptResults:Boolean=false):PartialResponse|undefined {
  const match = punctuationAndCaseInsensitiveMatch(responseString, responses);
  if (match) {
    const parentID = match.id
    const conceptResults = passConceptResults ? match.concept_results : null
    return punctuationAndCaseInsensitiveResponseBuilder(responses, parentID, conceptResults)
  }
}

export function punctuationAndCaseInsensitiveResponseBuilder(responses:Array<Response>, parentID:string|number, conceptResults?:Array<ConceptResult>): PartialResponse {
  const res = {
    feedback: feedbackStrings.punctuationAndCaseError,
    author: 'Punctuation and Case Hint',
    parent_id: parentID,
    concept_results: conceptResults ? conceptResults : [
      conceptResultTemplate('66upe3S5uvqxuHoHOt4PcQ'),
      conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
    ]
  }
  return res
}
