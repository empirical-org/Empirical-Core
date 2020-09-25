import * as _ from 'underscore'

import {Response, IncorrectSequence, FocusPoint} from '../../interfaces'
import {getOptimalResponses} from '../sharedResponseFunctions'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {exactMatch} from '../matchers/exact_match';
import {focusPointChecker} from '../matchers/focus_point_match'
import {incorrectSequenceChecker} from '../matchers/incorrect_sequence_match'
import {lengthChecker} from '../matchers/length_match'
import {punctuationEndChecker} from '../matchers/punctuation_end_match'
import {caseStartChecker} from '../matchers/case_start_match'
import {caseInsensitiveChecker} from '../matchers/case_insensitive_match'
import {punctuationInsensitiveChecker} from '../matchers/punctuation_insensitive_match'
import {punctuationAndCaseInsensitiveChecker} from '../matchers/punctuation_and_case_insensitive_match'
import {spacingBeforePunctuationChecker} from '../matchers/spacing_before_punctuation_match'
import {spacingAfterCommaChecker} from '../matchers/spacing_after_comma_match'
import {requiredWordsChecker} from '../matchers/required_words_match'
import {partsOfSpeechChecker} from '../matchers/parts_of_speech_match'

export async function checkDiagnosticSentenceFragment(hash:{
  question_uid: string,
  response: string,
  responses: Array<Response>,
  wordCountChange?: Object,
  ignoreCaseAndPunc?: Boolean,
  incorrectSequences?: Array<IncorrectSequence>,
  focusPoints?: Array<FocusPoint>,
  prompt: string,
  checkML?: Boolean,
  mlUrl?: string,
  defaultConceptUID?: string
}): Promise<Response> {

  const data = {
    response: hash.response.trim().replace(/\s{2,}/g, ' '),
    responses: _.sortBy(hash.responses, r => r.count).reverse(),
    incorrectSequences: hash.incorrectSequences,
    focusPoints: hash.focusPoints,
    wordCountChange: hash.wordCountChange,
    ignoreCaseAndPunc: hash.ignoreCaseAndPunc,
    prompt: hash.prompt,
    mlUrl: hash.mlUrl,
    checkML: hash.checkML,
    question_uid: hash.question_uid
  }

  const responseTemplate = {
    text: data.response,
    question_uid: hash.question_uid,
    count: 1,
    concept_results: hash.defaultConceptUID ? [conceptResultTemplate(hash.defaultConceptUID)] : []
  };

  const firstPass = checkForMatches(data, firstPassMatchers)
  if (firstPass) {
    const newResponse = Object.assign(responseTemplate, firstPass)
    if (['Punctuation End Hint', 'Capitalization Hint', 'Punctuation Hint', 'Punctuation and Case Hint', 'Spacing After Comma Hint'].includes(newResponse.author)) {
      newResponse.concept_results = hash.defaultConceptUID ? [conceptResultTemplate(hash.defaultConceptUID)] : []
    }
    return newResponse
  } else {
    return responseTemplate;
  }
}

function* firstPassMatchers(data, spellCorrected=false) {
  const {response, responses, incorrectSequences, focusPoints, ignoreCaseAndPunc, wordCountChange, prompt, checkML, mlUrl} = data;
  const submission =  response;

  yield exactMatch(submission, responses)
  yield focusPointChecker(submission, focusPoints, responses)
  yield incorrectSequenceChecker(submission, incorrectSequences, responses)
  yield partsOfSpeechChecker(submission, responses)
  if (!ignoreCaseAndPunc) {
    yield lengthChecker(submission, responses, prompt, wordCountChange)
    yield punctuationEndChecker(submission, responses)
    yield caseStartChecker(submission, responses)
    yield caseInsensitiveChecker(submission, responses)
    yield punctuationInsensitiveChecker(submission, responses)
    yield punctuationAndCaseInsensitiveChecker(submission, responses)
    yield spacingBeforePunctuationChecker(submission, responses)
    yield spacingAfterCommaChecker(submission, responses)
    yield requiredWordsChecker(submission, responses)
  }
}

function checkForMatches(data, matchingFunction: Function) {
  const gen = matchingFunction(data)
  let next = gen.next();
  while (true) {
    if (next.value || next.done) {
      break;
    }
    next = gen.next();
  }
  if (next.value) {
    return next.value;
  }

}
