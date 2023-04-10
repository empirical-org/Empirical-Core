import _ from 'underscore';
import constants from '../constants';
import quillNormalize from './quillNormalizer';
import { getOptimalResponses } from './sharedResponseFunctions';
const jsDiff = require('diff');

const ERROR_TYPES = {
  NO_ERROR: 'NO_ERROR',
  MISSING_WORD: 'MISSING_WORD',
  ADDITIONAL_WORD: 'ADDITIONAL_WORD',
  INCORRECT_WORD: 'INCORRECT_WORD',
};

String.prototype.quillNormalize = quillNormalize

export default class Question {
  constructor(data) {
    this.prompt = data.prompt;
    this.responses = data.responses;
    this.questionUID = data.questionUID;
  }

  checkMatch(response) {
    // remove leading and trailing whitespace
    response = response.trim();
    // make sure all words are single spaced
    response = response.replace(/\s{2,}/g, ' ');
    const returnValue = {
      found: true,
      submitted: response,
      response: {
        text: response,
        questionUID: this.questionUID,
        gradeIndex: `nonhuman${this.questionUID}`,
        count: 1,
      },
    };
    const res = returnValue.response;
    const exactMatch = this.checkExactMatch(response);
    if (exactMatch !== undefined) {
      returnValue.response = exactMatch;
      return returnValue;
    }
    const lowerCaseMatch = this.checkCaseInsensitiveMatch(response);
    if (lowerCaseMatch !== undefined) {
      res.feedback = constants.FEEDBACK_STRINGS.caseError;
      res.author = 'Capitalization Hint';
      res.parentID = lowerCaseMatch.key;
      this.copyParentResponses(res, lowerCaseMatch);
      return returnValue;
    }
    returnValue.found = false;
    returnValue.response.gradeIndex = `unmarked${this.questionUID}`;
    return returnValue;
  }

  nonChildResponses(responses) {
    return _.filter(this.responses, resp => resp.parentID === undefined && resp.feedback !== undefined);
  }

  checkExactMatch(response) {
    return _.find(this.responses, resp => resp.text.quillNormalize() === response.quillNormalize());
  }

  checkCaseInsensitiveMatch(response) {
    return _.find(getOptimalResponses(this.responses), resp => resp.text.quillNormalize().toLowerCase() === response.quillNormalize().toLowerCase());
  }
  copyParentResponses(newResponse, parentResponse) {
    if (parentResponse.conceptResults) {
      newResponse.conceptResults = Object.assign({}, parentResponse.conceptResults);
    }
  }
}
