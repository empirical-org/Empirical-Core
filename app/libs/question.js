import _ from 'underscore';
import fuzzy from 'fuzzyset.js'
const jsDiff = require('diff');


export default class Question {
  constructor(data) {
    this.prompt = data.prompt;
    this.sentences = data.sentences;
    this.responses = data.responses;
  }

  checkMatch(response) {
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
      returnValue.response = lowerCaseMatch
      return returnValue
    }
    var punctuationMatch = this.checkPunctuationInsensitiveMatch(response)
    if (punctuationMatch !== undefined) {
      returnValue.punctuationError = true
      returnValue.response = punctuationMatch
      return returnValue
    }
    var typingErrorMatch = this.checkSmallTypoMatch(response)
    if (typingErrorMatch !== undefined) {
      returnValue.typingError = true
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
    var response = undefined;
    var text = undefined;
    if (matches.length > 0) {
      text = matches[0][0] > 0.8 ? matches[0][1] : null;
    }
    if (text) {
      response = _.findWhere(this.responses, {text})
    }
    return response
  }
}

const removePunctuation = (string) => {
  return string.replace(/[^A-Za-z0-9\s]/g,"")
}

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
