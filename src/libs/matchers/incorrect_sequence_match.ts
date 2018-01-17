import * as _ from 'underscore'
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, IncorrectSequence} from '../../interfaces'

export function incorrectSequenceMatch(responseString: string, incorrectSequences:Array<IncorrectSequence>):IncorrectSequence {
  return _.find(incorrectSequences, (incSeq) => {
    const options = incSeq.text.split('|||');
    const anyMatches = _.any(options, opt => new RegExp(opt).test(responseString));
    return anyMatches;
  });
}
