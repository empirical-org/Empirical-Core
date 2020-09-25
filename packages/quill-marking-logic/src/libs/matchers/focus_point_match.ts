import * as _ from 'underscore'
import {stringNormalize} from 'quill-string-normalizer'

import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, FocusPoint, PartialResponse} from '../../interfaces'
import {conceptResultTemplate} from '../helpers/concept_result_template'


export function focusPointMatchHelper(responseString:string, focusPointParticle:string):boolean {
  // Given a focus point and a response string, return
  const matchList = focusPointParticle.split('&&'); // => "Dog&&Cat" => ['Dog', 'Cat']
  return matchList.every(m => new RegExp(m, 'i').test(responseString));
}


export function focusPointMatch(responseString:string, focusPoints:Array<FocusPoint>):FocusPoint {
  // respStr = "Bob is cool" (1), "James is cool (2)"
  // focusPts = [(Bob|||Katherine),(is|||was)]
  return _.find(focusPoints, (focusPoint) => {
    const options = focusPoint.text.split('|||');
    const anyMatches = _.any(options, particle => focusPointMatchHelper(stringNormalize(responseString), particle));
    return !anyMatches;
  }); // => null (1), (Bob|||Katherine) (2)

}

export function focusPointChecker(responseString: string, focusPoints:Array<FocusPoint>, responses:Array<Response>):PartialResponse|undefined {
  const match = focusPointMatch(responseString, focusPoints);
  if (match) {
    return focusPointResponseBuilder(match, responses)
  }
}

export function focusPointResponseBuilder(focusPointMatch:FocusPoint, responses:Array<Response>): PartialResponse {
  const res: PartialResponse = {
    feedback: focusPointMatch.feedback,
    author: 'Focus Point Hint',
    parent_id: getTopOptimalResponse(responses).id
  }

  if (focusPointMatch.concept_uid) {
    res.concept_results = [
      conceptResultTemplate(focusPointMatch.concept_uid)
    ];
  }

  if (focusPointMatch.concept_results) {
    res.concept_results = focusPointMatch.concept_results;
  }

  if (focusPointMatch.conceptResults) {
    res.concept_results = focusPointMatch.conceptResults;
  }
  return res;
}
