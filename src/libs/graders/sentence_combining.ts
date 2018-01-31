import {Response, IncorrectSequence, FocusPoint, GradingObject} from '../../interfaces'
import {correctSentenceFromSamples} from 'quill-spellchecker'
import {getOptimalResponses} from '../sharedResponseFunctions'

import {exactMatch} from '../matchers/exact_match';
import {focusPointChecker} from '../matchers/focus_point_match';
import {incorrectSequenceChecker} from '../matchers/incorrect_sequence_match'
import {caseInsensitiveChecker} from '../matchers/case_insensitive_match'
import {punctuationInsensitiveChecker} from '../matchers/punctuation_insensitive_match';
import {punctuationAndCaseInsensitiveChecker} from '../matchers/punctuation_and_case_insensitive_match'
import {spacingBeforePunctuationChecker} from '../matchers/spacing_before_punctuation_match'
import {spacingAfterCommaChecker} from '../matchers/spacing_after_comma_match'
import {whitespaceChecker} from '../matchers/whitespace_match'
import {rigidChangeObjectChecker, flexibleChangeObjectChecker} from '../matchers/change_object_match'
import {requiredWordsChecker} from '../matchers/required_words_match'
import {minLengthChecker} from '../matchers/min_length_match'
import {maxLengthChecker} from '../matchers/max_length_match'
import {caseStartChecker} from '../matchers/case_start_match'
import {punctuationEndChecker} from '../matchers/punctuation_end_match'

export function checkSentenceCombining(
  question_uid: string,
  response: string,
  responses: Array<Response>,
  focusPoints: Array<FocusPoint>|null,
  incorrectSequences: Array<IncorrectSequence>|null
): Response {
  const responseTemplate = {
    text: response,
    question_uid,
    count: 1
  }
  const data = {
    response,
    responses,
    focusPoints,
    incorrectSequences,
  }
  // Correct the spelling and try again.


  const firstPass = checkForMatches(data, firstPassMatchers)
  if (firstPass) {
    return Object.assign(responseTemplate, firstPass)
  }

  const spellCheckedData = prepareSpellingData(data)
  const spellingPass = checkForMatches(spellCheckedData, firstPassMatchers, true)
  if (spellingPass) {
    // Update the indicate spelling is also needed.
    return Object.assign(responseTemplate, spellingPass)
  }

  const secondPass = checkForMatches(spellCheckedData, secondPassMatchers)
  if (secondPass) {
    return Object.assign(responseTemplate, secondPass)
  }

}

function* firstPassMatchers(data: GradingObject, spellCorrected=false) {
  const {response, spellCorrectedResponse, responses, focusPoints, incorrectSequences} = data;
  const submission = spellCorrected ? spellCorrectedResponse : response
  yield exactMatch(submission, responses)
  yield focusPointChecker(submission, focusPoints, responses)
  yield incorrectSequenceChecker(submission, incorrectSequences, responses)
  yield caseInsensitiveChecker(submission, responses)
  yield punctuationInsensitiveChecker(submission, responses)
  yield punctuationAndCaseInsensitiveChecker(submission, responses)
  yield spacingBeforePunctuationChecker(submission, responses)
  yield spacingAfterCommaChecker(submission, responses)
  yield whitespaceChecker(submission, responses)
  yield rigidChangeObjectChecker(submission, responses)
}

function*secondPassMatchers(data: GradingObject, spellCorrected=false) {
  const {response, spellCorrectedResponse, responses, focusPoints, incorrectSequences} = data;
  yield flexibleChangeObjectChecker(response, responses)
  yield requiredWordsChecker(spellCorrectedResponse, responses)
  yield minLengthChecker(response, responses)
  yield maxLengthChecker(response, responses)
  yield caseStartChecker(response, responses)
  yield punctuationEndChecker(response, responses)
}

function checkForMatches(data: GradingObject, matchingFunction: Function, spellCorrected=false) {
  const gen = matchingFunction(data, spellCorrected)
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

function prepareSpellingData(data: GradingObject) {
  const spellingData = Object.assign({}, data)
  const optimalAnswerStrings = getOptimalResponses(data.responses).map(resp => resp.text)
  spellingData.spellCorrectedResponse = correctSentenceFromSamples(optimalAnswerStrings,data.response,false)
  return spellingData
}
