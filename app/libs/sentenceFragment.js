import _ from 'underscore';
import * as qpos from './partsOfSpeechTagging';

String.prototype.normalize = function () {
  return this.replace(/[\u201C\u201D]/g, '\u0022').replace(/[\u00B4\u0060\u2018\u2019]/g, '\u0027').replace('‚', ',');
};

export default class POSMatcher {

  constructor(data) {
    this.prompt = data.prompt;
    this.responses = data.responses;
    this.questionUID = data.questionUID;
    this.wordCountChange = data.wordCountChange;
  }

  getGradedResponses() {
    // Returns sorted collection optimal first followed by suboptimal
    const gradedResponses = _.reject(this.responses, response =>
      (response.optimal === undefined) || (response.author)
    );
    return _.sortBy(gradedResponses, 'optimal').reverse();
  }

  checkMatch(userSubmission) {
    const formattedResponse = userSubmission.trim().replace(/\s{2,}/g, ' ');
    const returnValue = {
      found: true,
      submitted: formattedResponse,
      posMatch: false,
      exactMatch: false,
    };

    const exactMatch = this.checkExactMatch(userSubmission);
    if (exactMatch !== undefined) {
      returnValue.response = exactMatch;
      returnValue.exactMatch = true;
      returnValue.posMatch = true; // An exact match implies a posMatch
      return returnValue;
    }

    const posMatch = this.checkPOSMatch(userSubmission);
    if (posMatch !== undefined) {
      returnValue.response = posMatch;
      returnValue.posMatch = true;
      return returnValue;
    }

    returnValue.found = false;
    return returnValue;
  }

  checkExactMatch(userSubmission) {
    return _.find(this.getGradedResponses(), response => response.text === userSubmission);
  }

  checkPOSMatch(userSubmission) {
    const correctPOSTags = this.getGradedResponses().map(
      optimalResponse => qpos.getPartsOfSpeechTags(optimalResponse.text)
    );
    const userPOSTags = qpos.getPartsOfSpeechTags(userSubmission);
    if (userPOSTags) {
      return _.find(this.getGradedResponses(), (optimalResponse, index) => {
        if (optimalResponse.parentID) {
          return false;
        } else if (correctPOSTags[index]) {
          if (JSON.stringify(correctPOSTags[index]) === JSON.stringify(userPOSTags)) {
            return true;
          }
        }
      });
    }
  }
}
