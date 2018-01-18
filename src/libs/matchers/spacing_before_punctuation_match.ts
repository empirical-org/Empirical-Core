import * as _ from 'underscore'
import {FeedbackObject} from '../../interfaces'
import {spacingBeforePunctuation} from '../algorithms/spacingBeforePunctuation'

export function spacingBeforePunctuationMatch(responseString:string):FeedbackObject|undefined {
  return spacingBeforePunctuation(responseString);
}
