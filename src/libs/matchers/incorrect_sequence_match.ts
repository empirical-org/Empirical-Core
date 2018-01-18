import * as _ from 'underscore'
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, IncorrectSequence, PartialResponse} from '../../interfaces'
import constants from '../../constants'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function incorrectSequenceMatch(responseString: string, incorrectSequences:Array<IncorrectSequence>):IncorrectSequence {
  return _.find(incorrectSequences, (incSeq) => {
    const options = incSeq.text.split('|||');
    const anyMatches = _.any(options, opt => new RegExp(opt).test(responseString));
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
    parentId: getTopOptimalResponse(responses).key
  }
    if (incorrectSequenceMatch.conceptResults) {
      res.concept_results = incorrectSequenceMatch.conceptResults;
    }
  return res;
}
