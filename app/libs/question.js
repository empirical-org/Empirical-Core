import _ from 'underscore'

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
}
