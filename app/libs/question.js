import _ from 'underscore';
import fuzzy from 'fuzzyset.js'
const jsDiff = require('diff');


export default class Question {
  constructor(prompt, sentences, responses) {
    this.prompt = prompt;
    this.sentences = sentences;
    this.responses = responses;
  }

  checkExactMatch(response) {
    return !!_.find(this.responses, (resp) => {
      return resp === response;
    });
  }

  checkCaseInsensitiveMatch(response) {
    return !!_.find(this.responses, (resp) => {
      return resp.toLowerCase() === response.toLowerCase();
    });
  }

  checkPunctuationInsensitiveMatch(response) {
    return !!_.find(this.responses, (resp) => {
      return resp.replace(/[^A-Za-z0-9\s]/g,"") === response.replace(/[^A-Za-z0-9\s]/g,"")
    });
  }

  checkSmallTypoMatch(response) {
    return !!_.find(this.responses, (resp) => {
      var diff = jsDiff.diffChars(response, resp)
      var additions = _.where(diff, {added: true})
      if (additions.length > 1) {
        return false
      }
      var count = _.reduce(additions, function(memo, num){ return memo + num.count; }, 0)
      if (count < 3) {
        return true
      }
      return false
    });
  }

  checkFuzzyMatch(response) {
    const set = fuzzy(this.responses);
    const matches = set.get(response, []);
    if (matches.length > 0) {
      return matches[0][0] > 0.8;
    }
    return false;
  }
}
