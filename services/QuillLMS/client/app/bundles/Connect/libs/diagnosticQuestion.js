import fuzzy from 'fuzzyset.js';
import _ from 'underscore';
import constants from '../constants';
import {
    checkChangeObjectMatch
} from './algorithms/changeObjects';
import { getOptimalResponses, getSubOptimalResponses } from './sharedResponseFunctions';

import quillNormalize from './quillNormalizer';
import { sortByLevenshteinAndOptimal } from './responseTools.js';

const jsDiff = require('diff');

const ERROR_TYPES = {
  NO_ERROR: 'NO_ERROR',
  MISSING_WORD: 'MISSING_WORD',
  ADDITIONAL_WORD: 'ADDITIONAL_WORD',
  INCORRECT_WORD: 'INCORRECT_WORD',
};

String.prototype.quillNormalize = quillNormalize

export default class Question {

  constructor(data) {
    this.prompt = data.prompt;
    this.sentences = data.sentences;
    this.responses = data.responses;
    this.questionUID = data.questionUID;
    this.focusPoints = data.focusPoints || [];
  }

  checkMatch(response) {
    // remove leading and trailing whitespace
    response = response.trim();
    // make sure all words are single spaced
    response = response.replace(/\s{2,}/g, ' ');
    const returnValue = {
      found: true,
      submitted: response,
      response: {
        text: response,
        questionUID: this.questionUID,
        gradeIndex: `nonhuman${this.questionUID}`,
        count: 1,
      },
    };
    const res = returnValue.response;
    const exactMatch = this.checkExactMatch(response);
    if (exactMatch !== undefined) {
      returnValue.response = exactMatch;
      return returnValue;
    }
    const lowerCaseMatch = this.checkCaseInsensitiveMatch(response);
    if (lowerCaseMatch !== undefined) {
      res.feedback = constants.FEEDBACK_STRINGS.caseError;
      res.author = 'Capitalization Hint';
      res.parentID = lowerCaseMatch.key;
      this.copyParentResponses(res, lowerCaseMatch);
      return returnValue;
    }
    const punctuationMatch = this.checkPunctuationInsensitiveMatch(response);
    if (punctuationMatch !== undefined) {
      res.feedback = constants.FEEDBACK_STRINGS.punctuationError;
      res.author = 'Punctuation Hint';
      res.parentID = punctuationMatch.key;
      this.copyParentResponses(res, punctuationMatch);
      return returnValue;
    }
    const punctuationAndCaseMatch = this.checkPunctuationAndCaseInsensitiveMatch(response);
    if (punctuationAndCaseMatch !== undefined) {
      res.feedback = constants.FEEDBACK_STRINGS.punctuationAndCaseError;
      res.author = 'Punctuation and Case Hint';
      res.parentID = punctuationAndCaseMatch.key;
      this.copyParentResponses(res, punctuationAndCaseMatch);
      return returnValue;
    }
    const minLengthMatch = this.checkMinLengthMatch(response);
    if (minLengthMatch !== undefined) {
      res.feedback = constants.FEEDBACK_STRINGS.minLengthError;
      res.author = 'Missing Details Hint';
      res.parentID = minLengthMatch.key;
      return returnValue;
    }
    const changeObjectMatch = this.checkChangeObjectLevenshteinMatch(response);
    if (changeObjectMatch !== undefined) {
      switch (changeObjectMatch.errorType) {
        case ERROR_TYPES.INCORRECT_WORD:
          res.feedback = constants.FEEDBACK_STRINGS.modifiedWordError;
          res.author = 'Modified Word Hint';
          res.parentID = changeObjectMatch.response.key;
          this.copyParentResponses(res, changeObjectMatch.response);
          return returnValue;
        case ERROR_TYPES.ADDITIONAL_WORD:
          res.feedback = constants.FEEDBACK_STRINGS.additionalWordError;
          res.author = 'Additional Word Hint';
          res.parentID = changeObjectMatch.response.key;
          this.copyParentResponses(res, changeObjectMatch.response);
          return returnValue;
        case ERROR_TYPES.MISSING_WORD:
          res.feedback = constants.FEEDBACK_STRINGS.missingWordError;
          res.author = 'Missing Word Hint';
          res.parentID = changeObjectMatch.response.key;
          this.copyParentResponses(res, changeObjectMatch.response);
          return returnValue;
        default:
          return;
      }
    }
    const whitespaceMatch = this.checkWhiteSpaceMatch(response);
    if (whitespaceMatch !== undefined) {
      res.feedback = constants.FEEDBACK_STRINGS.whitespaceError;
      res.author = 'Whitespace Hint';
      res.parentID = whitespaceMatch.key;
      this.copyParentResponses(res, whitespaceMatch);
      return returnValue;
    }
    returnValue.found = false;
    returnValue.response.gradeIndex = `unmarked${this.questionUID}`;
    return returnValue;
  }

  checkMinLengthMatch(response) {
    const optimalResponses = getOptimalResponses(this.responses);
    if (optimalResponses.length < 2) {
      return undefined;
    }
    const lengthsOfResponses = optimalResponses.map(resp => resp.text.quillNormalize().length);
    const minLength = _.min(lengthsOfResponses) - 10;
    if (response.length < minLength) {
      return _.sortBy(optimalResponses, resp => resp.text.quillNormalize().length)[0];
    }
    return undefined;
  }

  nonChildResponses(responses) {
    return _.filter(this.responses, resp => resp.parentID === undefined && resp.feedback !== undefined);
  }

  checkExactMatch(response) {
    return _.find(this.responses, resp => resp.text.quillNormalize() === response.quillNormalize());
  }

  checkCaseInsensitiveMatch(response) {
    return _.find(getOptimalResponses(this.responses), resp => resp.text.quillNormalize().toLowerCase() === response.quillNormalize().toLowerCase());
  }

  checkPunctuationInsensitiveMatch(response) {
    return _.find(getOptimalResponses(this.responses), resp => removePunctuation(resp.text.quillNormalize()) === removePunctuation(response.quillNormalize()));
  }

  checkPunctuationAndCaseInsensitiveMatch(response) {
    return _.find(getOptimalResponses(this.responses), (resp) => {
      const supplied = removeCaseSpacePunc(response);
      const target = removeCaseSpacePunc(resp.text);
      return supplied === target;
    });
  }

  checkWhiteSpaceMatch(response) {
    return _.find(getOptimalResponses(this.responses), resp => removeSpaces(response.quillNormalize()) === removeSpaces(resp.text.quillNormalize()));
  }

  checkChangeObjectLevenshteinMatch(response) {
    const fn = string => string.quillNormalize();
    const responses = sortByLevenshteinAndOptimal(response, getOptimalResponses(this.responses).concat(getSubOptimalResponses(this.responses)));
    return checkChangeObjectMatch(response, responses, fn, true);
  }

  checkChangeObjectRigidMatch(response) {
    const fn = string => string.quillNormalize();
    return checkChangeObjectMatch(response, getOptimalResponses(this.responses), fn);
  }

  checkChangeObjectSubMatch(response) {
    const fn = string => string.quillNormalize();
    return checkChangeObjectMatch(response, getSubOptimalResponses(this.responses), fn);
  }

  checkFuzzyMatch(response) {
    const set = fuzzy(_.map(_.pluck(this.responses, 'text'), resp => removeCaseSpacePunc(resp)));
    const matches = set.get(removeCaseSpacePunc(response), []);
    let foundResponse;
    let text;
    if (matches.length > 0) {
      const threshold = (matches[0][1].length - 1) / matches[0][1].length;
      text = (matches[0][0] >= threshold) ? matches[0][1] : null;
    }
    if (text) {
      foundResponse = _.findWhere(this.responses, resp => removeCaseSpacePunc(resp.text) === text);
    }
    return foundResponse;
  }

  copyParentResponses(newResponse, parentResponse) {
    if (parentResponse.conceptResults) {
      newResponse.conceptResults = Object.assign({}, parentResponse.conceptResults);
    }
  }

}

const removePunctuation = string => string.replace(/\./g, '');

const removeSpaces = string => string.replace(/\s+/g, '');

const removeCaseSpacePunc = (string) => {
  let transform = string.quillNormalize();
  transform = removePunctuation(transform);
  transform = removeSpaces(transform);
  return transform.toLowerCase();
};

// check number of chars added.

const getErrorType = (targetString, userString) => {
  const changeObjects = getChangeObjects(targetString, userString);
  const hasIncorrect = checkForIncorrect(changeObjects);
  const hasAdditions = checkForAdditions(changeObjects);
  const hasDeletions = checkForDeletions(changeObjects);
  if (hasIncorrect) {
    return ERROR_TYPES.INCORRECT_WORD;
  } else if (hasAdditions) {
    return ERROR_TYPES.ADDITIONAL_WORD;
  } else if (hasDeletions) {
    return ERROR_TYPES.MISSING_WORD;
  }
};
