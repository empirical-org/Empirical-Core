import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'
import * as _ from 'underscore'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {Response, PartialResponse} from '../../interfaces'
import constants from '../../constants'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function caseInsensitiveMatch(response: string, responses:Array<Response>):Response|undefined {
  return _.find(getOptimalResponses(responses),
    resp => stringNormalize(resp.text).toLowerCase() === stringNormalize(response).toLowerCase()
  );
}

export function caseInsensitiveChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = caseInsensitiveMatch(responseString, responses);
  if (match) {
    const parentID = match.key
    return caseInsensitiveResponseBuilder(responses, parentID)
  }
}

export function caseInsensitiveResponseBuilder(responses:Array<Response>, parentID:string|number): PartialResponse {
  const res = {
    feedback: constants.FEEDBACK_STRINGS.caseError,
    author: 'Capitalization Hint',
    parent_id: parentID,
    conceptResults: [
      conceptResultTemplate('66upe3S5uvqxuHoHOt4PcQ')
    ]
  }
  return res
}
