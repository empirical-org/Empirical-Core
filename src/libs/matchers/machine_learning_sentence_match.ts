import constants from '../../constants';
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, PartialResponse, ConceptResult, WordCountChange} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function machineLearningSentenceMatch(response: string, link: string):Promise<boolean> {
  const options = {
    method: 'POST',
    body: JSON.stringify({text: response}),
    // mode: 'cors',
    // credentials: 'include',
    headers: { "Content-Type": "application/json" }
  };
  const url = `${link}/fragments/is_sentence`
  const matched = fetch(url, options)
      .then(response => response.json())
      .then(parsedResponse => parsedResponse.text > 0.5)
  return matched
}

export async function machineLearningSentenceChecker(responseString: string, responses:Array<Response>, link:string, matcherFunction=machineLearningSentenceMatch):Promise<PartialResponse|undefined> {
  const match:Boolean = await machineLearningSentenceMatch(responseString, link);
  return machineLearningSentenceResponseBuilder(responses, match)
}

export function machineLearningSentenceResponseBuilder(responses: Array<Response>, matched:Boolean): PartialResponse {
  const res:PartialResponse = {
    author: 'Parts of Speech',
    parent_id: getTopOptimalResponse(responses).key,
    optimal: matched
  }
  if (matched) {
    res.feedback = "That's a strong sentence!"
  } else {
    res.feedback = "Revise your work. A complete sentence must have an action word and a person or thing doing the action."
  }
  return res
}
