import * as _ from 'underscore'
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, IncorrectSequence, PartialResponse} from '../../interfaces'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function incorrectSequenceMatchHelper(responseString:string, incorrectSequenceParticle:string):boolean {
  const matchList = incorrectSequenceParticle.split('&&');
  return matchList.every(m => new RegExp(m).test(responseString));
}

export function incorrectSequenceMatch(responseString: string, incorrectSequences:Array<IncorrectSequence>):IncorrectSequence {
  return _.find(incorrectSequences, (incSeq) => {
    const options = incSeq.text.split('|||');
    const anyMatches = _.any(options, particle => incorrectSequenceMatchHelper(responseString, particle));
    return anyMatches;
  });
}

export function incorrectSequenceChecker(responseString: string, incorrectSequences:Array<IncorrectSequence>, responses:Array<Response>):PartialResponse|undefined {
  const match = incorrectSequenceMatch(responseString, incorrectSequences);
  if (match) {
    return incorrectSequenceResponseBuilder(match, responses)
  }
}

export function incorrectSequenceResponseBuilder(incorrectSequenceMatch:IncorrectSequence, responses:Array<Response>): PartialResponse {
  const res: PartialResponse = {
    feedback: incorrectSequenceMatch.feedback,
    author: 'Incorrect Sequence Hint',
    parent_id: getTopOptimalResponse(responses).id
  }
    if (incorrectSequenceMatch.concept_results) {
      res.concept_results = incorrectSequenceMatch.concept_results;
    }
  return res;
}
