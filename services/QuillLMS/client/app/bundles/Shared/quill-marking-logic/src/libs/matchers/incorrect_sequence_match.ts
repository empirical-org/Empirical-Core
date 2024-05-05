import * as _ from 'underscore'
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, IncorrectSequence, PartialResponse} from '../../interfaces'
import {stringNormalize} from 'quill-string-normalizer'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function incorrectSequenceMatchHelper(responseString:string, incorrectSequenceParticle:string, caseInsensitive:boolean):boolean {
  const matchList = incorrectSequenceParticle.split('&&');
  const flags = caseInsensitive ? 'i' : ''
  return matchList.every(m => new RegExp(m, flags).test(responseString));
}

export function incorrectSequenceMatch(responseString: string, incorrectSequences:Array<IncorrectSequence>):IncorrectSequence {
  const sortedIncorrectSequences = incorrectSequences.sort((a, b) => (a.order || 0) - (b.order || 0));

  for (let i = 0; i < sortedIncorrectSequences.length; i++) {
    let incSeq = sortedIncorrectSequences[i];
    const options = incSeq.text.split('|||');
    const caseInsensitive = incSeq.caseInsensitive ? incSeq.caseInsensitive : false
    const anyMatches = _.any(options, particle => incorrectSequenceMatchHelper(responseString, particle, caseInsensitive));
    if (anyMatches) {
      return incSeq;
    }
  }

  return null;
}

export function incorrectSequenceChecker(responseString: string, incorrectSequences:Array<IncorrectSequence>, responses:Array<Response>):PartialResponse|undefined {
  const match = incorrectSequenceMatch(stringNormalize(responseString), incorrectSequences);
  if (match) {
    return incorrectSequenceResponseBuilder(match, responses)
  }
}

export function incorrectSequenceResponseBuilder(incorrectSequenceMatch:IncorrectSequence, responses:Array<Response>): PartialResponse {
  const res: PartialResponse = {
    feedback: incorrectSequenceMatch.feedback,
    author: incorrectSequenceMatch.name || 'Incorrect Sequence Hint',
    parent_id: getTopOptimalResponse(responses).id
  }

  if (incorrectSequenceMatch.concept_results) {
    res.concept_results = incorrectSequenceMatch.concept_results;
  }

  if (incorrectSequenceMatch.conceptResults) {
    res.concept_results = incorrectSequenceMatch.conceptResults;
  }

  return res;
}
