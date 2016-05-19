import _ from 'underscore';
import fuzzy from 'fuzzyset.js'
const jsDiff = require('diff');


export default class Question {
  constructor(data) {
    this.prompt = data.prompt;
    this.sentences = data.sentences;
    this.responses = data.responses;
  }

  getOptimalResponses() {
    return _.where(this.responses, {optimal: true})
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
    var lowerCaseMatch = this.checkCaseInsensitiveMatch(response)
    if (lowerCaseMatch !== undefined) {
      returnValue.caseError = true
      returnValue.author = "Capitalization Hint"
      returnValue.response = lowerCaseMatch
      return returnValue
    }
    var punctuationMatch = this.checkPunctuationInsensitiveMatch(response)
    if (punctuationMatch !== undefined) {
      returnValue.punctuationError = true
      returnValue.author = "Punctuation Hint"
      returnValue.response = punctuationMatch
      return returnValue
    }
    var typingErrorMatch = this.checkFuzzyMatch(response)
    if (typingErrorMatch !== undefined) {
      returnValue.typingError = true
      returnValue.author = "Word Error Hint"
      returnValue.response = typingErrorMatch
      return returnValue
    }
    var minLengthMatch = this.checkMinLengthMatch(response)
    if (minLengthMatch !== undefined) {
      returnValue.minLengthError = true
      returnValue.author = "Missing Details Hint"
      returnValue.response = minLengthMatch
      return returnValue
    }
    var maxLengthMatch = this.checkMaxLengthMatch(response)
    if (maxLengthMatch !== undefined) {
      returnValue.maxLengthError = true
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
      return resp.text === response;
    });
  }

  checkCaseInsensitiveMatch(response) {
    return _.find(this.nonChildResponses(this.responses), (resp) => {
      return resp.text.toLowerCase() === response.toLowerCase();
    });
  }

  checkPunctuationInsensitiveMatch(response) {
    return _.find(this.nonChildResponses(this.responses), (resp) => {
      return removePunctuation(resp.text) === removePunctuation(response)
    });
  }

  checkSmallTypoMatch(response) {
    return _.find(this.nonChildResponses(this.responses), (resp) => {
      return getLowAdditionCount(response, resp.text)
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
      return resp.text.split(" ").length;
    })
    const minLength = _.min(lengthsOfResponses)
    if (response.split(" ").length < minLength) {
      return _.sortBy(optimalResponses, (resp) => {
        return resp.text.length
      })[0]
    } else {
      return undefined
    }
  }

  checkMaxLengthMatch(response) {
    const optimalResponses = this.getOptimalResponses();
    if (optimalResponses.length < 5) {
      return undefined
    }
    const lengthsOfResponses = optimalResponses.map((resp) => {
      return resp.text.split(" ").length;
    })
    const maxLength = _.max(lengthsOfResponses)
    if (response.split(" ").length > maxLength) {
      return _.sortBy(optimalResponses, (resp) => {
        return resp.text.length
      }).reverse()[0]
    } else {
      return undefined
    }
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
