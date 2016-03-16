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
    var exactMatch = this.checkExactMatch(response)
    if (exactMatch.found) {
      return exactMatch
    }
    var lowerCaseMatch = this.checkCaseInsensitiveMatch(response)
    if (lowerCaseMatch.found) {
      lowerCaseMatch.caseError = true
      return lowerCaseMatch
    }
    var punctuationMatch = this.checkPunctuationInsensitiveMatch(response)
    if (punctuationMatch.found) {
      punctuationMatch.punctuationError = true
      return punctuationMatch
    }
    var typingErrorMatch = this.checkSmallTypoMatch(response)
    if (typingErrorMatch.found) {
      typingErrorMatch.typingError = true
      return typingErrorMatch
    }
    return { found: false }
  }

  checkExactMatch(response) {
    var response = _.find(this.responses, (resp) => {
      return resp.text === response;
    });
    return {found: !!response, response}
  }

  checkCaseInsensitiveMatch(response) {
    var response = _.find(this.responses, (resp) => {
      return resp.text.toLowerCase() === response.toLowerCase();
    });
    return {found: !!response, response}
  }

  checkPunctuationInsensitiveMatch(response) {
    var response = _.find(this.responses, (resp) => {
      return removePunctuation(resp.text) === removePunctuation(response)
    });
    return {found: !!response, response}
  }

  checkSmallTypoMatch(response) {
    var response = !!_.find(this.responses, (resp) => {
      return getLowAdditionCount(response, resp.text)
    });
    return {found: !!response, response}
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
    return {found: !!response, response}
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
