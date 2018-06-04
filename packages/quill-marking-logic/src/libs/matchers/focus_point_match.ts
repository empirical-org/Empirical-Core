import * as _ from 'underscore'
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, FocusPoint, PartialResponse} from '../../interfaces'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function focusPointMatch(responseString:string, focusPoints:Array<FocusPoint>):FocusPoint {
  return _.find(focusPoints, (fp) => {
    const options = fp.text.split('|||');
    // if it matches any focus point in a group (read|||reading|||write)
    const anyMatches = _.any(options, opt => responseString.indexOf(opt) !== -1);
    return !anyMatches;
  });
}

export function focusPointMatchNEW(responseString:string, focusPoints:Array<FocusPoint>):FocusPoint {
  return _.find(focusPoints, (focusPoint) => {
    const options = focusPoint.text.split('|||');
    const anyMatches = _.any(options, opt => new RegExp(opt).test(responseString));
    return anyMatches;
  });
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
  return res;
}
