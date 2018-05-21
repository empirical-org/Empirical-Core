import {Response, IncorrectSequence, FocusPoint, GradingObject} from '../../interfaces'
import {getOptimalResponses} from '../sharedResponseFunctions'

import {exactMatch} from '../matchers/exact_match';
import {caseInsensitiveChecker} from '../matchers/case_insensitive_match'

export function checkFillInTheBlankQuestion(
  question_uid: string,
  response: string,
  responses: Array<Response>
): Response {
  const data = {
    response: response.trim(),
    responses
  }
  const responseTemplate = {
    text: data.response,
    question_uid,
    count: 1
  };
  const firstPass = checkForMatches(data, firstPassMatchers)
  if (firstPass) {
    return Object.assign(responseTemplate, firstPass)
  }

  return responseTemplate;
}

function* firstPassMatchers(data) {
  const {response, responses, focusPoints} = data;
  const submission = response
  yield exactMatch(submission, responses)
  yield caseInsensitiveChecker(submission, responses, true)
}

function checkForMatches(data, matchingFunction: Function) {
  const gen = matchingFunction(data)
  let next = gen.next();
  while (true) {
    if (next.value || next.done) {
      break
    }
    next = gen.next()
  }
  if (next.value) {
    return next.value
  }

}
