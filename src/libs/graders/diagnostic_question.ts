import {Response, IncorrectSequence, FocusPoint, GradingObject} from '../../interfaces'
import {getOptimalResponses} from '../sharedResponseFunctions'

import {exactMatch} from '../matchers/exact_match';
import {caseInsensitiveChecker} from '../matchers/case_insensitive_match'
import {punctuationInsensitiveChecker} from '../matchers/punctuation_insensitive_match';
import {punctuationAndCaseInsensitiveChecker} from '../matchers/punctuation_and_case_insensitive_match'
import {minLengthChecker} from '../matchers/min_length_match'
import {whitespaceChecker} from '../matchers/whitespace_match'
import {levenshteinMatchObjectChecker} from '../matchers/change_object_match'

export function checkDiagnosticQuestion(
  question_uid: string,
  response: string,
  responses: Array<Response>
): Response {
  const data = {
    response: response.trim(),
    responses
  };

  const responseTemplate = {
    text: data.response,
    question_uid,
    count: 1,
    gradeIndex: `nonhuman${question_uid}`
  };

  const firstPass = checkForMatches(data, firstPassMatchers)
  if (firstPass) {
    return Object.assign(responseTemplate, firstPass)
  }

  responseTemplate.gradeIndex = `unmarked${question_uid}`
  return responseTemplate
}

function* firstPassMatchers(data) {
  const {response, responses, focusPoints, incorrectSequences} = data;
  const submission = response
  yield exactMatch(submission, responses)
  yield caseInsensitiveChecker(submission, responses, true)
  yield punctuationInsensitiveChecker(submission, responses, true)
  yield punctuationAndCaseInsensitiveChecker(submission, responses, true)
  yield minLengthChecker(submission, responses, true)
  yield levenshteinMatchObjectChecker(submission, responses)
  yield whitespaceChecker(submission, responses)
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
