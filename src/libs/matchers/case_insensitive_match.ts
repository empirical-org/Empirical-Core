import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response, PartialResponse, ConceptResult} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function caseInsensitiveMatch(response: string, responses:Array<Response>):Response|undefined {
  return _.find(getOptimalResponses(responses),
    resp => stringNormalize(resp.text).toLowerCase() === stringNormalize(response).toLowerCase()
  );
}

export function caseInsensitiveChecker(responseString: string, responses:Array<Response>, passConceptResults:Boolean=false):PartialResponse|undefined {
  const match = caseInsensitiveMatch(responseString, responses);
  if (match) {
    const parentID = match.id
    const conceptResults = passConceptResults ? match.concept_results : null
    return caseInsensitiveResponseBuilder(responses, parentID, conceptResults)
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
