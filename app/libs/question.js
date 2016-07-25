import _ from 'underscore';
import fuzzy from 'fuzzyset.js'
import constants from '../constants';
const jsDiff = require('diff');

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
    var typingErrorMatch = this.checkFuzzyMatch(response)
    if (typingErrorMatch !== undefined) {
      returnValue.typingError = true
      returnValue.feedback = constants.FEEDBACK_STRINGS.typingError;
      returnValue.author = "Word Error Hint"
      returnValue.response = typingErrorMatch
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

  checkSmallTypoMatch(response) {
    return _.find(this.nonChildResponses(this.responses), (resp) => {
      return getLowAdditionCount(response.normalize(), resp.text.normalize())
    });
  }

  checkFuzzyMatch(response) {
    const set = fuzzy(_.pluck(this.responses, "text"));
    const matches = set.get(response, []);
    var foundResponse = undefined;
    var text = undefined;
    if (matches.length > 0) {
      var threshold = (matches[0][1].length - 3) / matches[0][1].length
      // console.log("\nmatch: ", matches[0][0], " threshold: ", threshold)
      text = (matches[0][0] > threshold) && (response.split(" ").length <= matches[0][1].split(" ").length) ? matches[0][1] : null;
    }
    if (text) {
      foundResponse = _.findWhere(this.responses, {text})
    }
    return foundResponse
  }

  checkMinLengthMatch(response) {
    const optimalResponses = this.getOptimalResponses();
    if (optimalResponses.length < 5) {
      return undefined
    }
    const lengthsOfResponses = optimalResponses.map((resp) => {
      return resp.text.normalize().split(" ").length;
    })
    const minLength = _.min(lengthsOfResponses)
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
    if (optimalResponses.length < 5) {
      return undefined
    }
    const lengthsOfResponses = optimalResponses.map((resp) => {
      return resp.text.normalize().split(" ").length;
    })
    const maxLength = _.max(lengthsOfResponses)
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
