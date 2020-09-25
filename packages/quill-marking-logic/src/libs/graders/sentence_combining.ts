import * as _ from 'underscore';
import {correctSentenceFromSamples} from 'quill-spellchecker';

import {Response, PartialResponse, IncorrectSequence, FocusPoint, GradingObject} from '../../interfaces';
import {getOptimalResponses} from '../sharedResponseFunctions';
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {removePunctuation} from '../helpers/remove_punctuation'
import {exactMatch} from '../matchers/exact_match';
import {focusPointChecker} from '../matchers/focus_point_match';
import {incorrectSequenceChecker} from '../matchers/incorrect_sequence_match';
import {caseInsensitiveChecker} from '../matchers/case_insensitive_match';
import {punctuationInsensitiveChecker} from '../matchers/punctuation_insensitive_match';
import {punctuationAndCaseInsensitiveChecker} from '../matchers/punctuation_and_case_insensitive_match';
import {spacingBeforePunctuationChecker} from '../matchers/spacing_before_punctuation_match';
import {spacingAfterCommaChecker} from '../matchers/spacing_after_comma_match';
import {whitespaceChecker} from '../matchers/whitespace_match';
import {wordsOutOfOrderChecker} from '../matchers/words_out_of_order_match';
import {rigidChangeObjectChecker, flexibleChangeObjectChecker} from '../matchers/change_object_match';
import {requiredWordsChecker} from '../matchers/required_words_match';
import {minLengthChecker} from '../matchers/min_length_match';
import {maxLengthChecker} from '../matchers/max_length_match';
import {caseStartChecker} from '../matchers/case_start_match';
import {punctuationEndChecker} from '../matchers/punctuation_end_match';
import {spellingFeedbackStrings} from '../constants/feedback_strings';

export function checkSentenceCombining(
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
    concept_results: defaultConceptUID ? [conceptResultTemplate(defaultConceptUID)] : []
  };

  const firstPass = checkForMatches(data, firstPassMatchers); // returns partial response or null
  if (firstPass) {
    return Object.assign(responseTemplate, firstPass)
  };

  const spellCheckedData = prepareSpellingData(data);
  const spellingPass = checkForMatches(spellCheckedData, firstPassMatchers, true); // check for a match w the spelling corrected
  const misspelledWords = getMisspelledWords(data.response, spellCheckedData.spellCorrectedResponse)
  if (spellingPass) {
    let foundConcepts = spellingPass.concept_results
    //convert concept_results to an array if it's not already
    if (typeof foundConcepts === 'object' && foundConcepts.constructor === Object) {
      spellingPass.concept_results =
        Object.keys(foundConcepts).map((k) => foundConcepts[k])
    }
    if (Array.isArray(spellingPass.concept_results)) {
      spellingPass.concept_results.push(conceptResultTemplate('H-2lrblngQAQ8_s-ctye4g'));
    }
    const spellingAwareFeedback = getSpellingFeedback(spellingPass);
    const spellingFeedbackObj = {
      text: data.response,
      spelling_error: true,
      misspelled_words: misspelledWords
    }
    return Object.assign(responseTemplate, spellingAwareFeedback, spellingFeedbackObj);
  };

  const secondPass = checkForMatches(spellCheckedData, secondPassMatchers);
  if (secondPass) {
    return Object.assign(responseTemplate, secondPass);
  };

  return responseTemplate;
}

function* firstPassMatchers(data: GradingObject, spellCorrected=false) {
  const {response, spellCorrectedResponse, responses, focusPoints, incorrectSequences} = data;
  const submission = spellCorrected ? spellCorrectedResponse : response;
  yield exactMatch(submission, responses);
  if (!spellCorrected) {
    // we don't want to run the focus point checker and the incorrect sequence checker on spell-checked strings because our spellcheck library strips out a lot of punctuation that is sometimes included in those regexes
    yield focusPointChecker(submission, focusPoints, responses);
    yield incorrectSequenceChecker(submission, incorrectSequences, responses);
  }
  yield caseInsensitiveChecker(submission, responses);
  yield punctuationInsensitiveChecker(submission, responses);
  yield punctuationAndCaseInsensitiveChecker(submission, responses);
  yield spacingBeforePunctuationChecker(submission, responses);
  yield spacingAfterCommaChecker(submission, responses);
  yield whitespaceChecker(submission, responses);
  yield rigidChangeObjectChecker(submission, responses);
}

function* secondPassMatchers(data: GradingObject, spellCorrected=false) {
  const {response, spellCorrectedResponse, responses, focusPoints, incorrectSequences} = data;
  yield flexibleChangeObjectChecker(response, responses);
  yield requiredWordsChecker(spellCorrectedResponse, responses);
  yield minLengthChecker(response, responses);
  yield maxLengthChecker(response, responses);
  yield caseStartChecker(response, responses);
  yield wordsOutOfOrderChecker(spellCorrectedResponse, responses);
  yield punctuationEndChecker(response, responses);
}

function checkForMatches(data: GradingObject, matchingFunction: Function, spellCorrected=false): PartialResponse|null {
  const gen = matchingFunction(data, spellCorrected);
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

function prepareSpellingData(data: GradingObject) {
  const spellingData = Object.assign({}, data);
  const optimalAnswerStrings = getOptimalResponses(data.responses).map(resp => resp.text);
  spellingData.spellCorrectedResponse = correctSentenceFromSamples(optimalAnswerStrings, data.response, false);
  return spellingData;
}

function getSpellingFeedback(spellingMatch: Response|PartialResponse): PartialResponse {
  // build a hash of the spelling aware feedback from the google doc to your right ->
  // find the error type of the partial response, fetch the feedback from the hash,
  // and apply it to the passed match value (spellingMatch)
  const match = _.omit(spellingMatch, 'count', 'child_count', 'created_at', 'first_attempt_count', 'key', 'optimal');
  if (match.parent_id) {
    match.feedback = spellingFeedbackStrings[match.author];
  } else {
    match.author = 'Spelling Hint';
    match.feedback = spellingFeedbackStrings['Spelling Hint'];
    match.parent_id  = match.id;
    delete match.id;
  }
  match.feedback = match.feedback ? match.feedback : spellingMatch.feedback
  return match;
}

function getMisspelledWords(text: string, spellCheckedText: string) {
  const textArray: Array<string> = removePunctuation(text).split(' ')
  const spellCheckedTextArray: Array<string> = removePunctuation(spellCheckedText).split(' ')
  const misspelledWords = textArray.filter(word => !spellCheckedTextArray.includes(word))
  return misspelledWords
}
