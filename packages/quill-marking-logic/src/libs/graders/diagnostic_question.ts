import {Response, IncorrectSequence, FocusPoint, GradingObject} from '../../interfaces'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {exactMatch} from '../matchers/exact_match';
import {focusPointChecker} from '../matchers/focus_point_match';
import {incorrectSequenceChecker} from '../matchers/incorrect_sequence_match';
import {caseInsensitiveChecker} from '../matchers/case_insensitive_match'
import {punctuationInsensitiveChecker} from '../matchers/punctuation_insensitive_match';
import {punctuationAndCaseInsensitiveChecker} from '../matchers/punctuation_and_case_insensitive_match'
import {minLengthChecker} from '../matchers/min_length_match'
import {whitespaceChecker} from '../matchers/whitespace_match'
import {levenshteinMatchObjectChecker} from '../matchers/change_object_match'

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
    if (['Modified Word Hint', 'Spelling Hint', 'Additional Word Hint', 'Missing Word Hint', 'Whitespace Hint', 'Missing Details Hint'].includes(newResponse.author)) {
      newResponse.concept_results = defaultConceptUID ? [conceptResultTemplate(defaultConceptUID)] : []
    }
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
