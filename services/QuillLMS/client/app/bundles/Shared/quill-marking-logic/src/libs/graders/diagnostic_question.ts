import {Response, IncorrectSequence, FocusPoint} from '../../interfaces'
import {conceptResultTemplate} from '../helpers/concept_result_template'

import {exactMatch} from '../matchers/exact_match';
import {focusPointChecker} from '../matchers/focus_point_match';
import {incorrectSequenceChecker} from '../matchers/incorrect_sequence_match';

export function checkDiagnosticQuestion(
  question_uid: string,
  response: string,
  responses: Array<Response>,
  focusPoints: Array<FocusPoint>|null,
  incorrectSequences: Array<IncorrectSequence>|null,
  defaultConceptUID?: string
): Response {
  const data = {
    response: response.trim().replace(/\s{2,}/g, ' '),
    responses,
    focusPoints,
    incorrectSequences,
  };

  const responseTemplate = {
    text: data.response,
    question_uid,
    count: 1,
    gradeIndex: `nonhuman${question_uid}`,
    concept_results: defaultConceptUID ? [conceptResultTemplate(defaultConceptUID)] : []
  };

  const firstPass = checkForMatches(data, firstPassMatchers)
  if (firstPass) {
    const newResponse = Object.assign(responseTemplate, firstPass)
    return newResponse
  }

  responseTemplate.gradeIndex = `unmarked${question_uid}`
  return responseTemplate
}

function* firstPassMatchers(data) {
  const {response, responses, focusPoints, incorrectSequences} = data;
  const submission = response
  yield exactMatch(submission, responses)
  yield focusPointChecker(submission, focusPoints, responses);
  yield incorrectSequenceChecker(submission, incorrectSequences, responses);
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
