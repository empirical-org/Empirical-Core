import {Response, IncorrectSequence, FocusPoint, GradingObject} from '../../interfaces'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {conceptResultTemplate} from '../helpers/concept_result_template'

import {exactMatch} from '../matchers/exact_match';
import {caseInsensitiveChecker} from '../matchers/case_insensitive_match'

export function checkFillInTheBlankQuestion(
  question_uid: string,
  response: string,
  responses: Array<Response>,
  caseSensitive: boolean=true,
  defaultConceptUID?: string
): Response {
  const data = {
    response: response.trim().replace(/\s{2,}/g, ' '),
    responses,
    caseSensitive
  }
  const responseTemplate = {
    text: data.response,
    question_uid,
    count: 1,
    concept_results: defaultConceptUID ? [conceptResultTemplate(defaultConceptUID)] : []
  };
  const firstPass = checkForMatches(data, firstPassMatchers)
  if (firstPass) {
    return Object.assign(responseTemplate, firstPass)
  }

  return responseTemplate;
}

function* firstPassMatchers(data) {
  const {response, responses, caseSensitive} = data;
  const submission = response
  yield exactMatch(submission, responses)
  yield caseInsensitiveChecker(submission, responses, caseSensitive, true)
}

function checkForMatches(data, matchingFunction: Function) {
  console.log("checking for matches")
  console.log(data)
  const gen = matchingFunction(data)
  console.log(gen)
  let next = gen.next();
  console.log(next)
  while (true) {
    if (next.value || next.done) {
      break
    }
    console.log("going")
    next = gen.next()
    console.log(next)
  }
  if (next.value) {
    return next.value
  }

}
