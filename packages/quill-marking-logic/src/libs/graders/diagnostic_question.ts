import {Response, IncorrectSequence, FocusPoint} from '../../interfaces'

import {conceptResultTemplate} from '../helpers/concept_result_template'
import {exactMatch} from '../matchers/exact_match';

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
    concept_results: defaultConceptUID ? [conceptResultTemplate(defaultConceptUID)] : [],
    author: null,
  };

  const firstPass = checkForMatches(data)
  if (firstPass) {
    const newResponse = Object.assign(responseTemplate, firstPass)
    if (!newResponse.optimal) {
      newResponse.concept_results = defaultConceptUID ? [conceptResultTemplate(defaultConceptUID)] : []
    }
    return newResponse
  }
  responseTemplate.gradeIndex = `unmarked${question_uid}`
  responseTemplate.author = "Incorrect"
  return responseTemplate
}

function checkForMatches(data) {
  const {response, responses} = data;
  const submission = response

  return exactMatch(submission, responses)
}
