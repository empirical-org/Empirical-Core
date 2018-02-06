import * as _ from 'underscore'
import request from 'request'
import constants from '../../constants';
import {stringNormalize} from 'quill-string-normalizer'
import {getTopOptimalResponse} from '../sharedResponseFunctions'
import {Response, PartialResponse, ConceptResult, WordCountChange} from '../../interfaces'
import {feedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'

export function machineLearningSentenceMatch(response: string, link: string):Boolean {
  const options = {
    method: 'POST',
    uri: `${link}/fragments/is_sentence`,
    form: {
      text: response
    },
  };
  return request(options).then((parsedBody) => {
    return JSON.parse(parsedBody).text > 0.5
  })
}

export function machineLearningSentenceChecker(responseString: string, responses:Array<Response>, link:string):PartialResponse|undefined {
  const match = machineLearningSentenceMatch(responseString, link);
  return machineLearningSentenceResponseBuilder(responses, match)
}

export function machineLearningSentenceResponseBuilder(responses, matched:Boolean): PartialResponse {
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
