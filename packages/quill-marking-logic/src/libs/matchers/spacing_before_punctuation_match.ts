import * as _ from 'underscore'

import {FeedbackObject, PartialResponse, Response} from '../../interfaces'
import {spacingBeforePunctuation} from '../algorithms/spacingBeforePunctuation'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {getTopOptimalResponse} from '../sharedResponseFunctions'

export function spacingBeforePunctuationMatch(responseString:string):FeedbackObject|undefined {
  return spacingBeforePunctuation(responseString);
}

export function spacingBeforePunctuationChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = spacingBeforePunctuationMatch(responseString);
  if (match) {
    const feedback = match.feedback
    return spacingBeforePunctuationResponseBuilder(responses, feedback)
  }
}

export function spacingBeforePunctuationResponseBuilder(responses:Array<Response>, feedback: string): PartialResponse {
  const res = {
    feedback,
    author: 'Punctuation Hint',
    parent_id: getTopOptimalResponse(responses) ? getTopOptimalResponse(responses).id : undefined,
    concept_results: [
      conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
    ]
  }
  return res
}
