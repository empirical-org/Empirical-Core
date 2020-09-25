import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'

import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response, PartialResponse, ConceptResult} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function caseInsensitiveMatch(response: string, responses:Array<Response>, caseInsensitive):Response|undefined {
  // if caseInsensitive, match to all possible responses, else we only care about correct ones
  const responsesToSearch = caseInsensitive ? responses : getOptimalResponses(responses)
  return _.find(responsesToSearch,
    resp => stringNormalize(resp.text).toLowerCase() === stringNormalize(response).toLowerCase()
  );
}

export function caseInsensitiveChecker(responseString: string, responses:Array<Response>, passConceptResults:Boolean=false, caseInsensitive:Boolean=false, isDiagnosticFIB:Boolean=false):PartialResponse|undefined {
  const match = caseInsensitiveMatch(responseString, responses, caseInsensitive);
  let lenientCasing = caseInsensitive
  if (match) {
    const parentID = match.id
    // if the response is otherwise optimal and NOT a diagnostic fill in the blank response, we want to override caseInsensitive and call out casing errors
    if (match.optimal && responseString != match.text && !isDiagnosticFIB) {
      lenientCasing = false
    }
    const conceptResults = passConceptResults ? match.concept_results : null
    // if caseInsensitive, return the match as if it were an exact match
    return lenientCasing ? match : caseInsensitiveResponseBuilder(responses, parentID, conceptResults)
  }
}

export function caseInsensitiveResponseBuilder(responses:Array<Response>, parentID:string|number, conceptResults?:Array<ConceptResult>): PartialResponse {
  const res = {
    feedback: feedbackStrings.caseError,
    author: 'Capitalization Hint',
    parent_id: parentID,
    concept_results: conceptResults ? conceptResults : [
      conceptResultTemplate('66upe3S5uvqxuHoHOt4PcQ')
    ]
  }
  return res
}
