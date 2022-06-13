import * as _ from 'underscore';
import { diffWords } from 'diff';
import {stringNormalize} from 'quill-string-normalizer'

import {getOptimalResponses, getSubOptimalResponses} from '../sharedResponseFunctions'
import {processSentences, correct, train} from '../spellchecker/main';
import {Response, PartialResponse} from '../../interfaces'
import {removePunctuation} from '../helpers/remove_punctuation'
import {feedbackStrings, spellingFeedbackStrings} from '../constants/feedback_strings'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {sortByLevenshteinAndOptimal} from '../responseTools'

const CHANGED_WORD_MAX = 3

export interface TextChangesObject {
  missingText: string|null,
  extraneousText: string|null,
}
export interface ChangeObjectMatch {
  errorType?: string,
  response: Response,
  missingText: string|null,
  extraneousText: string|null,
}

export function rigidChangeObjectChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = rigidChangeObjectMatch(responseString, responses);
  if (match) {
    return rigidChangeObjectMatchResponseBuilder(match)
  }
}

export function flexibleChangeObjectChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = flexibleChangeObjectMatch(responseString, responses);
  if (match) {
    return flexibleChangeObjectMatchResponseBuilder(match)
  }
}

export function levenshteinMatchObjectChecker(responseString: string, responses:Array<Response>):PartialResponse|undefined {
  const match = levenshteinChangeObjectMatch(responseString, responses);
  if (match) {
    return rigidChangeObjectMatchResponseBuilder(match, true)
  }
}

export function rigidChangeObjectMatchResponseBuilder(match: ChangeObjectMatch, copyMatchConceptResults:Boolean=false): PartialResponse|null {
  const res: PartialResponse = {}
  const matchConceptResults = match.response.concept_results || match.response.conceptResults
  switch (match.errorType) {
    case ERROR_TYPES.INCORRECT_WORD:
      res.feedback = feedbackStrings.modifiedWordError;
      res.author = 'Modified Word Hint';
      res.parent_id = match.response.key;
      res.concept_results = copyMatchConceptResults && matchConceptResults ? matchConceptResults : [
        conceptResultTemplate('N5VXCdTAs91gP46gATuvPQ')
      ];
      return res;
    case ERROR_TYPES.MISSPELLED_WORD:
      res.feedback = spellingFeedbackStrings['Spelling Hint'];
      res.author = 'Spelling Hint';
      res.parent_id = match.response.key;
      res.misspelled_words = [match.extraneousText]
      res.concept_results = copyMatchConceptResults && matchConceptResults ? matchConceptResults : [
        conceptResultTemplate('H-2lrblngQAQ8_s-ctye4g')
      ];
      return res;
    case ERROR_TYPES.ADDITIONAL_WORD:
      res.feedback = feedbackStrings.additionalWordError;
      res.author = 'Additional Word Hint';
      res.parent_id = match.response.key;
      res.concept_results = copyMatchConceptResults && matchConceptResults ? matchConceptResults : [
        conceptResultTemplate('QYHg1tpDghy5AHWpsIodAg')
      ];
      return res;
    case ERROR_TYPES.MISSING_WORD:
      res.feedback = feedbackStrings.missingWordError;
      res.author = 'Missing Word Hint';
      res.parent_id = match.response.key;
      res.concept_results = copyMatchConceptResults && matchConceptResults ? matchConceptResults : [
        conceptResultTemplate('N5VXCdTAs91gP46gATuvPQ')
      ];
      return res;
    default:
      return;
  }
}

export function flexibleChangeObjectMatchResponseBuilder(match: ChangeObjectMatch): PartialResponse|null {
  const initialVals = rigidChangeObjectMatchResponseBuilder(match);
  initialVals.author = "Flexible " + initialVals.author;
  return initialVals;
}

export function rigidChangeObjectMatch(response: string, responses: Array<Response>) {
  const fn = string => stringNormalize(string);
  return checkChangeObjectMatch(response, getOptimalResponses(responses), fn);
}

export function flexibleChangeObjectMatch(response: string, responses: Array<Response>) {
  const fn = string => removePunctuation(stringNormalize(string)).toLowerCase();
  return checkChangeObjectMatch(response, getOptimalResponses(responses), fn);
}

export function levenshteinChangeObjectMatch(response: string, responses: Array<Response>) {
  const fn = string => stringNormalize(string);
  const sortedResponses = sortByLevenshteinAndOptimal(response, getOptimalResponses(responses).concat(getSubOptimalResponses(responses)));
  return checkChangeObjectMatch(response, getOptimalResponses(sortedResponses), fn);
}


export function checkChangeObjectMatch(userString: string, responses: Array<Response>, stringManipulationFn: (string: string) => string, skipSort: boolean = false): ChangeObjectMatch|null {
  if (!skipSort) {
    responses = _.sortBy(responses, 'count').reverse();
  }
  let matchedErrorType;
  const matched = _.find(responses, (response) => {
    matchedErrorType = getErrorType(stringManipulationFn(response.text), stringManipulationFn(userString), responses);
    return matchedErrorType;
  });
  if (matched) {
    const textChanges = getMissingAndAddedString(stringManipulationFn(matched.text), stringManipulationFn(userString));
    return Object.assign(
      {},
      {
        response: matched,
        errorType: matchedErrorType,
      },
      textChanges
    );
  }
}

const ERROR_TYPES = {
  NO_ERROR: 'NO_ERROR',
  MISSING_WORD: 'MISSING_WORD',
  ADDITIONAL_WORD: 'ADDITIONAL_WORD',
  INCORRECT_WORD: 'INCORRECT_WORD',
  MISSPELLED_WORD: 'MISSPELLED_WORD',
};

const getErrorType = (targetString:string, userString:string, responses):string|null => {
  const changeObjects = getChangeObjects(targetString, userString);
  const hasIncorrect = checkForIncorrect(changeObjects);
  if (hasIncorrect) {
    const addedWord:string = changeObjects.find(co => co.added) ? changeObjects.find(co => co.added).value : undefined
    const removedWord:string = changeObjects.find(co => co.removed) ? changeObjects.find(co => co.removed).value : undefined
    if (addedWord && removedWord) {
      const optimalAnswerStrings = getOptimalResponses(responses).map(resp => resp.text);
      const dictionaryString = processSentences(optimalAnswerStrings)
      const dictionary = train(dictionaryString)
      const correctedString = correct(dictionary, addedWord)
      if (correctedString === removedWord) {
        return ERROR_TYPES.MISSPELLED_WORD
      }
    }
    return ERROR_TYPES.INCORRECT_WORD;
  }
  const hasAdditions = checkForAdditions(changeObjects);
  if (hasAdditions) {
    return ERROR_TYPES.ADDITIONAL_WORD;
  }
  const hasDeletions = checkForDeletions(changeObjects);
  if (hasDeletions) {
    return ERROR_TYPES.MISSING_WORD;
  }
};

const getMissingAndAddedString = (targetString: string, userString: string): TextChangesObject => {
  const changeObjects = getChangeObjects(targetString, userString);
  const missingObject = changeObjects.find(change => change.removed)
  const missingText = missingObject ? missingObject.value : undefined;
  const extraneousObject = changeObjects ? changeObjects.find(change => change.added) : null
  const extraneousText = extraneousObject ? extraneousObject.value : undefined;
  return {
    missingText,
    extraneousText,
  };
};

const getChangeObjects = (targetString, userString): Array<any> => diffWords(targetString, userString);

const checkForIncorrect = (changeObjects):boolean => {
  let tooLongError = false;
  const found = false;
  let foundCount = 0;
  let coCount = 0;
  changeObjects.forEach((current, index, array) => {
    tooLongError = checkForTooLongError(current);
    if (checkForAddedOrRemoved(current)) {
      coCount += 1;
    }
    if (current.removed && getLengthOfChangeObject(current) < 2 && index === array.length - 1) {
      foundCount += 1;
    } else {
      foundCount += current.removed && getLengthOfChangeObject(current) < 2 && array[index + 1].added ? 1 : 0;
    }
  });
  return !tooLongError && (foundCount === 1) && (coCount === 2);
};

const checkForAdditions = (changeObjects):boolean => {
  let tooLongError = false;
  const found = false;
  let foundCount = 0;
  let coCount = 0;
  changeObjects.forEach((current, index, array) => {
    if (checkForAddedOrRemoved(current)) {
      coCount += 1;
    }
    tooLongError = checkForTooLongError(current);
    if (current.added && getLengthOfChangeObject(current) < CHANGED_WORD_MAX && index === 0) {
      foundCount += 1;
    } else {
      foundCount += current.added && getLengthOfChangeObject(current) < CHANGED_WORD_MAX && !array[index - 1].removed ? 1 : 0;
    }
  });
  return !tooLongError && foundCount < CHANGED_WORD_MAX && (foundCount === coCount);
};

const checkForDeletions = (changeObjects):boolean => {
  let tooLongError = false;
  const found = false;
  let foundCount = 0;
  let coCount = 0;
  changeObjects.forEach((current, index, array) => {
    if (checkForAddedOrRemoved(current)) {
      coCount += 1;
    }
    tooLongError = checkForTooLongError(current);
    if (current.removed && getLengthOfChangeObject(current) < CHANGED_WORD_MAX && index === array.length - 1) {
      foundCount += 1;
    } else {
      foundCount += current.removed && getLengthOfChangeObject(current) < CHANGED_WORD_MAX && !array[index + 1].added ? 1 : 0;
    }
  });
  return !tooLongError && foundCount < CHANGED_WORD_MAX && (foundCount === coCount);
};

const checkForAddedOrRemoved = changeObject => changeObject.removed || changeObject.added;

const checkForTooLongChangeObjects = changeObject => getLengthOfChangeObject(changeObject) >= CHANGED_WORD_MAX;

const checkForTooLongError = changeObject => (changeObject.removed || changeObject.added) && checkForTooLongChangeObjects(changeObject);

const getLengthOfChangeObject = changeObject => {
  // filter boolean removes empty strings from trailing,
  // leading, or double white space.
  const wordsInChangeObject = changeObject.value.split(' ').filter(Boolean)
  return wordsInChangeObject ? wordsInChangeObject.length : 0
}
