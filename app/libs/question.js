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
    var focusPointMatch = this.checkFocusPointMatch(response)
    if (focusPointMatch !== undefined) {
      returnValue.focusPointError = true;
      returnValue.feedback = focusPointMatch.feedback;
      returnValue.author = "Focus Point Hint";
      returnValue.response = this.getTopOptimalResponse();
      return returnValue;
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
    var changeObjectMatch = this.checkChangeObjectRigidMatch(response)
    if (changeObjectMatch !== undefined) {
      switch (changeObjectMatch.errorType) {
        case ERROR_TYPES.INCORRECT_WORD:
          returnValue.modifiedWordError = true
          returnValue.feedback = constants.FEEDBACK_STRINGS.modifiedWordError;
          returnValue.author = "Modified Word Hint"
          returnValue.response = changeObjectMatch.response
          return returnValue
        case ERROR_TYPES.ADDITIONAL_WORD:
          returnValue.additionalWordError = true
          returnValue.feedback = constants.FEEDBACK_STRINGS.additionalWordError;
          returnValue.author = "Additional Word Hint"
          returnValue.response = changeObjectMatch.response
          return returnValue
        case ERROR_TYPES.MISSING_WORD:
          returnValue.missingWordError = true
          returnValue.feedback = constants.FEEDBACK_STRINGS.missingWordError;
          returnValue.author = "Missing Word Hint"
          returnValue.response = changeObjectMatch.response
          return returnValue
        default:
          return
      }
    }
    var changeObjectFlexMatch = this.checkChangeObjectFlexibleMatch(response)
    if (changeObjectFlexMatch !== undefined) {
      switch (changeObjectFlexMatch.errorType) {
        case ERROR_TYPES.INCORRECT_WORD:
          returnValue.modifiedWordError = true
          returnValue.feedback = constants.FEEDBACK_STRINGS.modifiedWordError;
          returnValue.author = "Modified Word Hint"
          returnValue.response = changeObjectFlexMatch.response
          return returnValue
        case ERROR_TYPES.ADDITIONAL_WORD:
          returnValue.additionalWordError = true
          returnValue.feedback = constants.FEEDBACK_STRINGS.additionalWordError;
          returnValue.author = "Additional Word Hint"
          returnValue.response = changeObjectFlexMatch.response
          return returnValue
        case ERROR_TYPES.MISSING_WORD:
          returnValue.missingWordError = true
          returnValue.feedback = constants.FEEDBACK_STRINGS.missingWordError;
          returnValue.author = "Missing Word Hint"
          returnValue.response = changeObjectFlexMatch.response
          return returnValue
        default:
          return
      }
    }
    var whitespaceMatch = this.checkWhiteSpaceMatch(response)
    if (whitespaceMatch !== undefined) {
      returnValue.whitespaceError = true
      returnValue.feedback = constants.FEEDBACK_STRINGS.whitespaceError;
      returnValue.author = "Whitespace Hint"
      returnValue.response = whitespaceMatch
      return returnValue
    }
    var minLengthMatch = this.checkMinLengthMatch(response)
    if (minLengthMatch !== undefined) {
      returnValue.minLengthError = true
      returnValue.feedback = constants.FEEDBACK_STRINGS.minLengthError;
      returnValue.author = "Missing Details Hint"
      returnValue.response = minLengthMatch
      return returnValue
    }
    var maxLengthMatch = this.checkMaxLengthMatch(response)
    if (maxLengthMatch !== undefined) {
      returnValue.maxLengthError = true
      returnValue.feedback = constants.FEEDBACK_STRINGS.maxLengthError;
      returnValue.author = "Not Concise Hint"
      returnValue.response = maxLengthMatch
      return returnValue
    }
    var lowerCaseStartMatch = this.checkCaseStartMatch(response)
    if (lowerCaseStartMatch !== undefined) {
      returnValue.caseError = true
      returnValue.feedback = constants.FEEDBACK_STRINGS.caseError;
      returnValue.author = "Capitalization Hint"
      returnValue.response = lowerCaseStartMatch
      return returnValue
    }
    var punctuationEndMatch = this.checkPunctuationEndMatch(response)
    if (punctuationEndMatch !== undefined) {
      returnValue.punctuationError = true
      returnValue.feedback = constants.FEEDBACK_STRINGS.punctuationError;
      returnValue.author = "Punctuation Hint"
      returnValue.response = punctuationEndMatch
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

  checkCaseStartMatch(response) {
    if (response[0] && response[0].toLowerCase() === response[0]) {
      return this.getTopOptimalResponse()
    }
  }

  checkPunctuationEndMatch(response) {
    var lastChar = response[response.length - 1]
    if (lastChar && lastChar.match(/[a-z]/i)) {
      return this.getTopOptimalResponse()
    }
  }

  checkPunctuationInsensitiveMatch(response) {
    return _.find(this.getOptimalResponses(), (resp) => {
      return removePunctuation(resp.text.normalize()) === removePunctuation(response.normalize())
    });
  }

  checkPunctuationAndCaseInsensitiveMatch(response) {
    return _.find(this.getOptimalResponses(), (resp) => {
      const supplied = removePunctuation(response.normalize()).toLowerCase()
      const target = removePunctuation(resp.text.normalize()).toLowerCase()
      return supplied === target
    });
  }

  checkWhiteSpaceMatch(response) {
    return _.find(this.getOptimalResponses(), (resp) => {
      return removeSpaces(response.normalize()) === removeSpaces(resp.text.normalize())
    })
  }

  checkSmallTypoMatch(response) {
    return _.find(this.nonChildResponses(this.responses), (resp) => {
      return getLowAdditionCount(response.normalize(), resp.text.normalize())
    });
  }

  checkChangeObjectRigidMatch(response) {
    const optimalResponses = _.sortBy(this.getOptimalResponses(), 'count').reverse()
    var matchedErrorType;
    const matched = _.find(optimalResponses, (optimalResponse) => {
      const errorType = getErrorType(optimalResponse.text.normalize(), response.normalize())
      matchedErrorType = errorType
      return errorType
    })
    if (matched) {
      return {
        response: matched,
        errorType: matchedErrorType
      }
    }
  }

  checkChangeObjectFlexibleMatch(response) {
    const optimalResponses = _.sortBy(this.getOptimalResponses(), 'count').reverse()
    var matchedErrorType;
    const matched = _.find(optimalResponses, (optimalResponse) => {
      const errorType = getErrorType(removePunctuation(optimalResponse.text.normalize()).toLowerCase(), removePunctuation(response.normalize()).toLowerCase())
      matchedErrorType = errorType
      return errorType
    })
    if (matched) {
      return {
        response: matched,
        errorType: matchedErrorType
      }
    }
  }

  checkFuzzyMatch(response) {
    const set = fuzzy(_.pluck(this.responses, "text"));
    const matches = set.get(response, []);
    var foundResponse = undefined;
    var text = undefined;
    if (matches.length > 0) {
      var threshold = (matches[0][1].length - 3) / matches[0][1].length
      text = (matches[0][0] > threshold) && (response.split(" ").length <= matches[0][1].split(" ").length) ? matches[0][1] : null;
    }
    if (text) {
      foundResponse = _.findWhere(this.responses, {text})
    }
    return foundResponse
  }

  checkMinLengthMatch(response) {
    const optimalResponses = this.getOptimalResponses();
    if (optimalResponses.length < 2) {
      return undefined
    }
    const lengthsOfResponses = optimalResponses.map((resp) => {
      return resp.text.normalize().split(" ").length;
    })
    const minLength = _.min(lengthsOfResponses) - 1
    if (response.split(" ").length < minLength) {
      return _.sortBy(optimalResponses, (resp) => {
        return resp.text.normalize().length
      })[0]
    } else {
      return undefined;
    }
  }

  checkMaxLengthMatch(response) {
    const optimalResponses = this.getOptimalResponses();
    if (optimalResponses.length < 2) {
      return undefined
    }
    const lengthsOfResponses = optimalResponses.map((resp) => {
      return resp.text.normalize().split(" ").length;
    })
    const maxLength = _.max(lengthsOfResponses) + 1
    if (response.split(" ").length > maxLength) {
      return _.sortBy(optimalResponses, (resp) => {
        return resp.text.normalize().length
      }).reverse()[0]
    } else {
      return undefined
    }
  }

  checkFocusPointMatch(response) {
    return _.find(this.focusPoints, (fp) => {
      return response.indexOf(fp.text) === -1;
    });
  }
}

const removePunctuation = (string) => {
  return string.replace(/[^A-Za-z0-9\s]/g,"")
}

const removeSpaces = (string) => {
  return string.replace(/\s+/g, '');
}

// Check number of chars added.

const getLowAdditionCount = (newString, oldString) => {
  var diff = jsDiff.diffChars(newString, oldString)
  var additions = _.where(diff, {added: true})
  if (additions.length > 1) {
    return false
  }
  var count = _.reduce(additions, function(memo, num){ return memo + num.count; }, 0)
  if (count < 3) {
    return true
  }
  return false
}

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

const getChangeObjects = (targetString, userString) => {
  return diffWords(targetString, userString)
};

const errorLog = (text) => {
  // console.log("\n\n#####\n")
  // console.log(text)
  // console.log("\n#####\n")
}

const checkForIncorrect = (changeObjects) => {
  var tooLongError = false
  var found = false
  var foundCount = 0
  var coCount = 0
  changeObjects.forEach((current, index, array) => {
    if (current.removed || current.added) {
      coCount += 1
    }
    if (current.removed && current.value.split(" ").filter(Boolean).length >= 2) {
      tooLongError = true
    }
    if (current.added && current.value.split(" ").filter(Boolean).length >= 2) {
      tooLongError = true
    }
    if (current.removed && current.value.split(" ").filter(Boolean).length < 2 && index === array.length - 1) {
      foundCount += 1
    } else {
      foundCount += !!(current.removed && current.value.split(" ").filter(Boolean).length < 2 && array[index + 1].added) ? 1 : 0
    }
  })
  return !tooLongError && (foundCount === 1) && (coCount === 2)
}

const checkForAdditions = (changeObjects) => {
  var tooLongError = false
  var found = false
  var foundCount = 0
  var coCount = 0
  changeObjects.forEach((current, index, array) => {
    if (current.removed || current.added) {
      coCount += 1
    }
    if (current.removed && current.value.split(" ").filter(Boolean).length >= 2) {
      tooLongError = true
    }
    if (current.added && current.value.split(" ").filter(Boolean).length >= 2) {
      tooLongError = true
    }
    if (current.added && current.value.split(" ").filter(Boolean).length < 2 && index === 0) {
      foundCount += 1
    } else {
      foundCount += !!(current.added && current.value.split(" ").filter(Boolean).length < 2 && !array[index - 1].removed) ? 1 : 0
    }
  })
  return !tooLongError && (foundCount === 1) && (coCount === 1)
}

const checkForDeletions = (changeObjects) => {
  var tooLongError = false
  var found = false
  var foundCount = 0
  var coCount = 0
  changeObjects.forEach((current, index, array) => {
    if (current.removed || current.added) {
      coCount += 1
    }
    if (current.removed && current.value.split(" ").filter(Boolean).length >= 2) {
      tooLongError = true
    }
    if (current.added && current.value.split(" ").filter(Boolean).length >= 2) {
      tooLongError = true
    }
    if (current.removed && current.value.split(" ").filter(Boolean).length < 2 && index === array.length - 1) {
      foundCount += 1
    } else {
      foundCount += !!(current.removed && current.value.split(" ").filter(Boolean).length < 2 && !array[index + 1].added) ? 1 : 0
    }
  })
  return !tooLongError && (foundCount === 1) && (coCount === 1)
}
