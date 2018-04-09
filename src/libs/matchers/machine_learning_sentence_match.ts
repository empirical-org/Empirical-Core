import constants from '../../constants';
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, PartialResponse, ConceptResult, WordCountChange} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function machineLearningSentenceMatch(response: string, link: string): Promise<any> {
  const options = {
    method: 'POST',
    body: JSON.stringify({text: response}),
    // mode: 'cors',
    // credentials: 'include',
    headers: { "Content-Type": "application/json" }
  };
  const url = `${link}/sentence_or_not`;
  const matched = fetch(url, options)
    .then(response => response.json())
    .then((parsedResponse) => {
      if (parsedResponse.primary_error) {
        return parsedResponse;
      }
    });
  return matched;
}

export async function machineLearningSentenceChecker(responseString: string, responses: Array<Response>, link: string, matcherFunction: Function = machineLearningSentenceMatch): Promise<PartialResponse|undefined> {
  const matched: any = await matcherFunction(responseString, link);
  return matched.match ? machineLearningSentenceResponseBuilder(responses, matched) : undefined;
}

export function machineLearningSentenceResponseBuilder(responses: Array<Response>, match: any): PartialResponse {
  const res: PartialResponse = {
    author: match.primary_error,
    parent_id: getTopOptimalResponse(responses).id,
    optimal: false,
    feedback: match.human_readable
  }
  return res;
}
