import constants from '../../constants';
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, PartialResponse, ConceptResult, WordCountChange} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export async function spacyPOSSentenceMatch(response: string, question_uid: string, link: string): Promise<any> {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      text: response, 
      question_id: question_uid
    }),
    // mode: 'cors',
    // credentials: 'include',
    headers: { "Content-Type": "application/json" }
  };
  const url = `${link}/get_pos_match`;
  return await fetch(url, options)
      .then(response => response.json())
      .then(parsedResponse => parsedResponse.match);
}

export async function spacyPOSSentenceChecker(responseString: string, question_uid: string, link:string, matcherFunction:Function=spacyPOSSentenceMatch):Promise<PartialResponse|undefined> {
  const match: any = await matcherFunction(responseString, question_uid, link);
  return match ? spacyPOSSentenceResponseBuilder(match) : undefined;
}

export function spacyPOSSentenceResponseBuilder(match:any): PartialResponse {
  const res: PartialResponse = {
    author: 'Parts of Speech',
    parent_id: match.id,
    optimal: match.optimal,
    feedback: match.feedback
  };
  return res;
}
