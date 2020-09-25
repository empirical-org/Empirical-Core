import * as _ from 'underscore'

import {Response, PartialResponse} from '../../interfaces'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {feedbackStrings} from '../constants/feedback_strings'

export function spacingAfterCommaMatch(response):Boolean {
  for (let i = 0; i < response.length; i+=1) {
    if (response[i] === ',' && (i + 1 < response.length)) {
      const priorCharacter = response[i - 1]
      const followingCharacter = response[i + 1]
      // there needs to either be a space or the comma needs to appear between two numbers or before a quotation mark
      if (followingCharacter !== ' ' && (priorCharacter && !priorCharacter.match(/\d/) && followingCharacter && !followingCharacter.match(/\d/)) && (followingCharacter && !followingCharacter.match(/"/))) {
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
    feedback: feedbackStrings.spacingAfterCommaError,
    author: 'Spacing After Comma Hint',
    parent_id: getTopOptimalResponse(responses) ? getTopOptimalResponse(responses).id : undefined,
    concept_results: [
      conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
    ]
  }
  return res
}
