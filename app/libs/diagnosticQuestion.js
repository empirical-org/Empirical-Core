import _ from 'underscore';
import fuzzy from 'fuzzyset.js'
import constants from '../constants';
import {diffWords} from 'diff';
const jsDiff = require('diff');

const ERROR_TYPES = {
  NO_ERROR: 'NO_ERROR',
  MISSING_WORD: "MISSING_WORD",
  ADDITIONAL_WORD: "ADDITIONAL_WORD",
  INCORRECT_WORD: "INCORRECT_WORD"
}

String.prototype.normalize = function() {
  return this.replace(/[\u201C\u201D]/g, '\u0022').replace(/[\u00B4\u0060\u2018\u2019]/g, '\u0027').replace('‚', ',');
}

export default class Question {
  constructor(data) {
    this.prompt = data.prompt;
    this.sentences = data.sentences;
    this.responses = data.responses;
    this.focusPoints = data.focusPoints || [];
  }

  getOptimalResponses() {
    return _.where(this.responses, {optimal: true})
  }

  getSubOptimalResponses(responses) {
    return _.filter(this.responses, function (resp){
      return resp.parentID === undefined && resp.feedback !== undefined && resp.optimal !== true
    })
  }

  getTopOptimalResponse() {
    return _.sortBy(this.getOptimalResponses(), (r) => {
      return r.count
    }).reverse()[0]
  }

  getWeakResponses() {
    return _.filter(this.responses, function (resp) {
      return resp.weak === true
    })
  }

  getCommonUnmatchedResponses() {
    return _.filter(this.responses, function (resp) {
      return resp.feedback === undefined && resp.count > 2
    })
  }

  getSumOfWeakAndCommonUnmatchedResponses() {
    return this.getWeakResponses().length + this.getCommonUnmatchedResponses().length
  }

  getPercentageWeakResponses() {
    return (this.getSumOfWeakAndCommonUnmatchedResponses() / this.responses.length * 100).toPrecision(4)
  }

  checkMatch(response) {
    // remove leading and trailing whitespace
    response = response.trim();
    // make sure all words are single spaced
    response = response.replace(/\s{2,}/g, ' ');
    var returnValue = {
      found: true,
      submitted: response
    }
    var exactMatch = this.checkExactMatch(response)
    if (exactMatch !== undefined) {
      returnValue.response = exactMatch
      return returnValue
    }
    var whitespaceMatch = this.checkWhiteSpaceMatch(response)
    if (whitespaceMatch !== undefined) {
      returnValue.whitespaceError = true
      returnValue.feedback = constants.FEEDBACK_STRINGS.whitespaceError;
      returnValue.author = "Whitespace Hint"
      returnValue.response = whitespaceMatch
      return returnValue
    }
    var lowerCaseMatch = this.checkCaseInsensitiveMatch(response)
    if (lowerCaseMatch !== undefined) {
      returnValue.caseError = true
      returnValue.feedback = constants.FEEDBACK_STRINGS.caseError;
      returnValue.author = "Capitalization Hint"
      returnValue.response = lowerCaseMatch
      return returnValue
    }
    var punctuationMatch = this.checkPunctuationInsensitiveMatch(response)
    if (punctuationMatch !== undefined) {
      returnValue.punctuationError = true
      returnValue.feedback = constants.FEEDBACK_STRINGS.punctuationError;
      returnValue.author = "Punctuation Hint"
      returnValue.response = punctuationMatch
      return returnValue
    }
    var punctuationAndCaseMatch = this.checkPunctuationAndCaseInsensitiveMatch(response)
    if (punctuationAndCaseMatch !== undefined) {
      returnValue.punctuationAndCaseError = true
      returnValue.feedback = constants.FEEDBACK_STRINGS.punctuationAndCaseError;
      returnValue.author = "Punctuation and Case Hint"
      returnValue.response = punctuationAndCaseMatch
      return returnValue
    }
    var typingErrorMatch = this.checkFuzzyMatch(response)
    if (typingErrorMatch !== undefined) {
      returnValue.typingError = true
      returnValue.feedback = constants.FEEDBACK_STRINGS.typingError;
      returnValue.author = "Word Error Hint"
      returnValue.response = typingErrorMatch
      return returnValue
    }

    returnValue.found = false
    return returnValue
  }

  nonChildResponses(responses) {
    return _.filter(this.responses, function (resp){
      return resp.parentID === undefined && resp.feedback !== undefined
    })
  }

  checkExactMatch(response) {
    return _.find(this.responses, (resp) => {
      return resp.text.normalize() === response.normalize();
    });
  }

  checkCaseInsensitiveMatch(response) {
    return _.find(this.getOptimalResponses(), (resp) => {
      return resp.text.normalize().toLowerCase() === response.normalize().toLowerCase();
    });
  }

  checkPunctuationInsensitiveMatch(response) {
    return _.find(this.getOptimalResponses(), (resp) => {
      return removePunctuation(resp.text.normalize()) === removePunctuation(response.normalize())
    });
  }
  
  checkPunctuationAndCaseInsensitiveMatch(response) {
    return _.find(this.getOptimalResponses(), (resp) => {
      const supplied = removeCaseSpacePunc(response)
      const target = removeCaseSpacePunc(resp.text)
      return supplied === target
    });
  }

  checkWhiteSpaceMatch(response) {
    return _.find(this.getOptimalResponses(), (resp) => {
      return removeSpaces(response.normalize()) === removeSpaces(resp.text.normalize())
    })
  }

  checkFuzzyMatch(response) {
    const set = fuzzy(_.pluck(this.responses, "text"));
    const matches = set.get(response, []);
    var foundResponse = undefined;
    var text = undefined;
    if (matches.length > 0) {
      var threshold = (matches[0][1].length - 2) / matches[0][1].length
      text = (matches[0][0] > threshold) && (response.split(" ").length <= matches[0][1].split(" ").length) ? matches[0][1] : null;
    }
    if (text) {
      foundResponse = _.findWhere(this.responses, {text})
    }
    return foundResponse
  }

}

const removePunctuation = (string) => {
  return string.replace(/\./g,"")
}

const removeSpaces = (string) => {
  return string.replace(/\s+/g, '');
}

const removeCaseSpacePunc = (string) => {
  let transform = string.normalize();
  transform = removePunctuation(transform)
  transform = removeSpaces(transform)
  return transform.toLowerCase()
}

// Check number of chars added.

const getErrorType = (targetString, userString) => {
  const changeObjects = getChangeObjects(targetString, userString)
  const hasIncorrect = checkForIncorrect(changeObjects)
  const hasAdditions = checkForAdditions(changeObjects)
  const hasDeletions = checkForDeletions(changeObjects)
  if (hasIncorrect) {
    return ERROR_TYPES.INCORRECT_WORD
  } else if (hasAdditions) {
    return ERROR_TYPES.ADDITIONAL_WORD
  } else if (hasDeletions) {
    return ERROR_TYPES.MISSING_WORD
  } else {
    return
  }
}
