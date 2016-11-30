import _ from 'underscore';
import * as qpos from './partsOfSpeechTagging';
import { hashToCollection } from './hashToCollection';

String.prototype.normalize = function () {
  return this.replace(/[\u201C\u201D]/g, '\u0022').replace(/[\u00B4\u0060\u2018\u2019]/g, '\u0027').replace('‚', ',');
};

export default class POSMatcher {
  constructor(responses) {
    const responsesCollection = hashToCollection(responses);
    this.optimalResponses = _.sortBy(_.reject(responsesCollection, response =>
      response.optimal === undefined
    ), 'optimal').reverse();
  }

  checkMatch(userResponse) {
    const formattedResponse = userResponse.trim().replace(/\s{2,}/g, ' ');
    const returnValue = {
      found: true,
      submitted: formattedResponse,
      posMatch: false,
      exactMatch: false,
    };

    const exactMatch = this.checkExactMatch(userResponse);
    if (exactMatch !== undefined) {
      returnValue.response = exactMatch;
      returnValue.exactMatch = true;
      returnValue.posMatch = true; // An exact match implies a posMatch
      return returnValue;
    }

    const posMatch = this.checkPOSMatch(userResponse);
    if (posMatch !== undefined) {
      returnValue.response = posMatch;
      returnValue.posMatch = true;
      return returnValue;
    }

    returnValue.found = false;
    return returnValue;
  }

  checkExactMatch(userResponse) {
    return _.find(this.optimalResponses, response => response.text === userResponse);
  }

  checkPOSMatch(userResponse) {
    const correctPOSTags = this.optimalResponses.map(
      optimalResponse => qpos.getPartsOfSpeechTags(optimalResponse.text)
    );
    const userPOSTags = qpos.getPartsOfSpeechTags(userResponse);
    if (userPOSTags) {
      return _.find(this.optimalResponses, (optimalResponse, index) => {
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
