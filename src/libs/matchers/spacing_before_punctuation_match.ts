import * as _ from 'underscore'
import {Response} from '../../interfaces'
import {spacingBeforePunctuation} from '../algorithms/spacingBeforePunctuation'

export function spacingBeforePunctuationMatch(response) {
  return spacingBeforePunctuation(response);
}
