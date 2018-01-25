import * as _ from 'underscore'
import {Response, PartialResponse} from '../../interfaces'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import FEEDBACK_STRINGS from '../constants/feedback_strings'

export function spacingAfterCommaMatch(response):Boolean {
  for (let i = 0; i < response.length; i++) {
    if (response[i] === ',' && (i + 1 < response.length)) {
      if (response[i + 1] !== ' ') {
        return true
      };
    }
  }
  return false;
}

export function spacingAfterCommaChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = spacingAfterCommaMatch(responseString);
  if (match) {
    return spacingAfterCommaResponseBuilder(responses)
  }
}

export function spacingAfterCommaResponseBuilder(responses:Array<Response>): PartialResponse {
  const res = {
    feedback: FEEDBACK_STRINGS.spacingAfterCommaError,
    author: 'Punctuation Hint',
    parent_id: getTopOptimalResponse(responses) ? getTopOptimalResponse(responses).id : undefined,
    concept_results: [
      conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
    ]
  }
  return res
}
