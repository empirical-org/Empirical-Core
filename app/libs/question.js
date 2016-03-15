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
}
