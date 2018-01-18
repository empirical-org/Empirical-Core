import * as _ from 'underscore'
import {Response, FeedbackObject} from '../../interfaces'

export function spacingAfterCommaMatch(response):FeedbackObject|undefined {
  for (let i = 0; i < response.length; i++) {
    if (response[i] === ',' && (i + 1 < response.length)) {
      if (response[i + 1] !== ' ') {
        return {
          feedback: '<p>Revise your work. Always put a space after a <em>comma</em>.</p>',
        };
      }
    }
  }
  return undefined;
}
