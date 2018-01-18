import * as _ from 'underscore'
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, FocusPoint} from '../../interfaces'

export function focusPointMatch(responseString:string, focusPoints:Array<FocusPoint>):FocusPoint {
  return _.find(focusPoints, (fp) => {
    const options = fp.text.split('|||');
    const anyMatches = _.any(options, opt => responseString.indexOf(opt) !== -1);
    return !anyMatches;
  });
}
