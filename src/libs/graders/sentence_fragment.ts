import * as _ from 'underscore'
import {Response, IncorrectSequence} from '../../interfaces'
import {getOptimalResponses} from '../sharedResponseFunctions'

import {exactMatch} from '../matchers/exact_match';
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
import {spacyPOSSentenceChecker} from '../matchers/spacy_pos_match'
import {machineLearningSentenceChecker} from '../matchers/machine_learning_sentence_match'

export function checkSentenceFragment(hash:{
  question_uid: string,
  response: string,
  responses: Array<Response>,
  wordCountChange?: Object,
  ignoreCaseAndPunc?: Boolean,
  incorrectSequences?: Array<IncorrectSequence>,
  prompt: string,
  checkML?: Boolean,
  mlUrl?: string
}): Response {
  const responseTemplate = {
    text: hash.response,
    question_uid: hash.question_uid,
    count: 1
  };
  const data = {
    response: hash.response,
    responses: _.sortBy(hash.responses, r => r.count).reverse(),
    incorrectSequences: hash.incorrectSequences,
    wordCountChange: hash.wordCountChange,
    ignoreCaseAndPunc: hash.ignoreCaseAndPunc,
    prompt: hash.prompt,
    mlUrl: hash.mlUrl,
    checkML: hash.checkML,
    question_uid: hash.question_uid
  }

  const firstPass = checkForMatches(data, firstPassMatchers)
  if (firstPass) {
    return Object.assign(responseTemplate, firstPass)
  }

  return responseTemplate;
}

function* firstPassMatchers(data, spellCorrected=false) {
  const {response, responses, incorrectSequences, ignoreCaseAndPunc, wordCountChange, prompt, checkML, mlUrl} = data;
  const submission =  response;

  yield exactMatch(submission, responses)
  yield incorrectSequenceChecker(submission, incorrectSequences, responses)
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
  yield spacyPOSSentenceChecker(submission, data.question_uid, mlUrl)
  if (checkML) {
    yield machineLearningSentenceChecker(submission, responses, mlUrl)
  }

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
