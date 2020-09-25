import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'

import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response, PartialResponse, ConceptResult} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {removePunctuation} from '../helpers/remove_punctuation'

export function punctuationInsensitiveMatch(responseString: string, responses: Array<Response>):Response|undefined {
  return _.find(getOptimalResponses(responses),
    resp => removePunctuation(stringNormalize(resp.text)) === removePunctuation(stringNormalize(responseString))
  );
}

export function punctuationInsensitiveChecker(responseString: string, responses:Array<Response>, passConceptResults:Boolean=false):PartialResponse|undefined {
  const match = punctuationInsensitiveMatch(responseString, responses);
  if (match) {
    const parentID = match.id
    const conceptResults = passConceptResults ? match.concept_results : null
    return punctuationInsensitiveResponseBuilder(responses, parentID, conceptResults)
  }
}

export function punctuationInsensitiveResponseBuilder(responses:Array<Response>, parentID:string|number, conceptResults?:Array<ConceptResult>): PartialResponse {
  const res = {
    feedback: feedbackStrings.punctuationError,
    author: 'Punctuation Hint',
    parent_id: parentID,
    concept_results: conceptResults ? conceptResults : [
      conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
    ]
  }
  return res
}
