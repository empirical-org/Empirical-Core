import _ from 'underscore';
import * as qpos from './partsOfSpeechTagging';
import validEndingPunctuation from '../libs/validEndingPunctuation.js';
import constants from '../constants';
import { checkForMissingWords } from './requiredWords';
import {
  spacingBeforePunctuation
} from './algorithms/spacingBeforePunctuation';
import request from 'request-promise';

const conceptResultTemplate = (conceptUID, correct = false) => ({
  conceptUID,
  correct,
});

export function wordLengthCount(str) {
  const strNoPunctuation = str.replace(/[^0-9a-z\s]/gi, '').replace(/\s{2,}/g, ' ').split(' ');
  return strNoPunctuation.length;
}

function sortbyCount(responses) {
  return _.sortBy(responses, r => r.count).reverse();
}

function removePunctuation(string) {
  return string.replace(/[^A-Za-z0-9\s]/g, '');
}

export default class POSMatcher {

  constructor(data) {
    this.prompt = data.prompt;
    this.responses = sortbyCount(data.responses);
    this.questionUID = data.questionUID;
    this.wordCountChange = data.wordCountChange || {};
    this.ignoreCaseAndPunc = data.ignoreCaseAndPunc;
    this.incorrectSequences = data.incorrectSequences || [];
  }

  getOptimalResponses() {
    return _.reject(this.responses, response =>
      (response.optimal !== true) || (response.parentID)
    );
  }

  getTopOptimalResponse() {
    return _.sortBy(this.getOptimalResponses(), r => r.count).reverse()[0];
  }

  getGradedResponses() {
    // returns sorted collection optimal first followed by suboptimal
    const gradedResponses = _.reject(this.responses, response =>
      (response.optimal === undefined) || (response.parentID)
    );
    return _.sortBy(gradedResponses, 'optimal').reverse();
  }

  checkMatch(userSubmission, utl) {
    const formattedResponse = userSubmission.trim().replace(/\s{2,}/g, ' ');
    const returnValue = {
      found: true,
      submitted: formattedResponse,
      response: {
        text: formattedResponse,
        questionUID: this.questionUID,
        gradeIndex: `nonhuman${this.questionUID}`,
        count: 1,
      },
    };
    const res = returnValue.response;
    const exactMatch = this.checkExactMatch(userSubmission);
    if (exactMatch !== undefined) {
      returnValue.response = exactMatch;
      return returnValue;
    }
    const incorrectSequenceMatch = this.checkIncorrectSequenceMatch(userSubmission);
    if (incorrectSequenceMatch !== undefined) {
      returnValue.response = Object.assign({}, res, incorrectSequenceMatch);
      return returnValue;
    }
    const lengthMatch = this.checkLengthMatch(userSubmission);
    if (lengthMatch !== undefined) {
      returnValue.response = Object.assign({}, res, lengthMatch);
      return returnValue;
    }

    const endingPunctuationMatch = this.checkEndingPunctuationMatch(userSubmission);
    if (endingPunctuationMatch !== undefined) {
      returnValue.response = Object.assign({}, res, endingPunctuationMatch);
      return returnValue;
    }

    const startingCapitalizationMatch = this.checkStartingCapitalization(userSubmission);
    if (startingCapitalizationMatch !== undefined) {
      returnValue.response = Object.assign({}, res, startingCapitalizationMatch);
      return returnValue;
    }

    const optimalCapitalizationMatch = this.checkOptimalCapitalizationMatch(userSubmission);
    if (optimalCapitalizationMatch !== undefined) {
      returnValue.response = Object.assign({}, res, optimalCapitalizationMatch);
      return returnValue;
    }

    const optimalPunctuationMatch = this.checkOptimalPunctuationMatch(userSubmission);
    if (optimalPunctuationMatch !== undefined) {
      returnValue.response = Object.assign({}, res, optimalPunctuationMatch);
      return returnValue;
    }

    const punctuationAndCaseMatch = this.checkPunctuationAndCaseInsensitiveMatch(userSubmission);
    if (punctuationAndCaseMatch !== undefined) {
      returnValue.response = Object.assign({}, res, punctuationAndCaseMatch);
      return returnValue;
    }

    const spacingBeforePunctuationMatch = this.checkSpacingBeforePunctuationMatch(userSubmission);
    if (spacingBeforePunctuationMatch !== undefined) {
      returnValue.response = Object.assign({}, res, spacingBeforePunctuationMatch);
      return returnValue;
    }

    const spacingAfterCommaMatch = this.checkSpacingAfterCommaMatch(userSubmission);
    if (spacingAfterCommaMatch !== undefined) {
      returnValue.response = Object.assign({}, res, spacingAfterCommaMatch);
      return returnValue;
    }

    const requiredWordsMatch = this.checkRequiredWordsMatch(userSubmission);
    if (requiredWordsMatch !== undefined) {
      returnValue.response = Object.assign({}, res, requiredWordsMatch);
      return returnValue;
    }

    const posMatch = this.checkPOSMatch(userSubmission);
    if (posMatch !== undefined) {
      returnValue.response = Object.assign({}, res, posMatch);
      return returnValue;
    }

    const mlMatch = this.checkMLMatch(userSubmission, returnValue, utl);

  }

  checkExactMatch(userSubmission) {
    return _.find(this.responses, response => response.text === userSubmission);
  }

  checkIncorrectSequenceMatch(userSubmission) {
    const match = _.find(this.incorrectSequences, (incSeq) => {
      const options = incSeq.text.split('|||');
      const anyMatches = _.any(options, opt => userSubmission.toLowerCase().indexOf(opt) !== -1);
      return anyMatches;
    });
    if (match !== undefined) {
      return {
        optimal: false,
        parentID: this.getTopOptimalResponse().key,
        author: 'Incorrect Sequence Hint',
        feedback: match.feedback,
        conceptResults: match.conceptResults ? match.conceptResults : undefined,
      };
    }
  }

  checkLengthMatch(userSubmission) {
    if (this.ignoreCaseAndPunc) {
      return;
    }
    const userWordCount = wordLengthCount(userSubmission);
    const promptWordCount = wordLengthCount(this.prompt);
    const maxWordCount = promptWordCount + this.wordCountChange.max;
    const minWordCount = promptWordCount + this.wordCountChange.min;
    const templateResponse = {
      optimal: false,
      parentID: this.getTopOptimalResponse().key,
    };
    const feedback = getMinMaxFeedback(this.wordCountChange.min, this.wordCountChange.max);
    if (this.wordCountChange.min && (userWordCount < minWordCount)) {
      if (this.wordCountChange.min === 1) {
        return Object.assign({}, templateResponse, {
          feedback,
          author: 'Too Short Hint',
        });
      } else if (this.wordCountChange.min === this.wordCountChange.max) {
        return Object.assign({}, templateResponse, {
          feedback,
          author: 'Too Short Hint',
        });
      }
      return Object.assign({}, templateResponse, {
        feedback,
        author: 'Too Short Hint',
      });
    } else if (this.wordCountChange.max && (userWordCount > maxWordCount)) {
      if (this.wordCountChange.max === 1) {
        return Object.assign({}, templateResponse, {
          feedback,
          author: 'Too Long Hint',
        });
      }
      return Object.assign({}, templateResponse, {
        feedback,
        author: 'Too Long Hint',
      });
    }
  }

  checkEndingPunctuationMatch(userSubmission) {
    if (this.ignoreCaseAndPunc) {
      return;
    }
    const lastChar = _.last(userSubmission);
    if (!_.includes(validEndingPunctuation, lastChar)) {
      return {
        optimal: false,
        parentID: this.getTopOptimalResponse().key,
        author: 'Punctuation End Hint',
        feedback: 'Proofread your sentence for missing punctuation.',
        conceptResults: [
          conceptResultTemplate('JVJhNIHGZLbHF6LYw605XA')
        ],
      };
    }
  }

  checkStartingCapitalization(userSubmission) {
    if (this.ignoreCaseAndPunc) {
      return;
    }
    // only trigger if sentence begins with a lower case letter
    if ((/^[a-z]/).test(userSubmission)) {
      return {
        optimal: false,
        parentID: this.getTopOptimalResponse().key,
        author: 'Starting Capitalization Hint',
        feedback: 'Proofread your sentence for correct capitalization.',
        conceptResults: [
          conceptResultTemplate('S76ceOpAWR-5m-k47nu6KQ')
        ],
      };
    }
  }

  checkOptimalCapitalizationMatch(userSubmission) {
    if (this.ignoreCaseAndPunc) {
      return;
    }
    const optimals = this.getOptimalResponses();
    for (let i = 0; i < optimals.length; i++) {
      const optimal = optimals[i];
      if (userSubmission.toLowerCase() === optimal.text.toLowerCase()) {
        if (userSubmission !== optimal) {
          return {
            optimal: false,
            parentID: optimal.key,
            author: 'Capitalization Hint',
            feedback: 'Proofread your sentence for correct capitalization.',
            conceptResults: [
              conceptResultTemplate('66upe3S5uvqxuHoHOt4PcQ')
            ],
          };
        }
      }
    }
  }

  checkOptimalPunctuationMatch(userSubmission) {
    if (this.ignoreCaseAndPunc) {
      return;
    }
    const optimals = this.getOptimalResponses();
    for (let i = 0; i < optimals.length; i++) {
      const optimal = optimals[i];
      if (removePunctuation(userSubmission) === removePunctuation(optimal.text)) {
        if (userSubmission !== optimal) {
          return {
            optimal: false,
            parentID: optimal.key,
            author: 'Punctuation Hint',
            feedback: 'Proofread your sentence for correct punctuation.',
            conceptResults: [
              conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
            ],
          };
        }
      }
    }
  }

  checkPunctuationAndCaseInsensitiveMatch(userSubmission) {
    if (this.ignoreCaseAndPunc) {
      return;
    }
    const optimals = this.getOptimalResponses();
    for (let i = 0; i < optimals.length; i++) {
      const optimal = optimals[i];
      if (removePunctuation(userSubmission).toLowerCase() === removePunctuation(optimal.text).toLowerCase()) {
        if (userSubmission !== optimal) {
          return {
            optimal: false,
            parentID: optimal.key,
            author: 'Punctuation and Case Hint',
            feedback: 'Proofread your sentence for correct capitalization and punctuation.',
            conceptResults: [
              conceptResultTemplate('66upe3S5uvqxuHoHOt4PcQ'),
              conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
            ],
          };
        }
      }
    }
  }

  checkSpacingBeforePunctuationMatch(userSubmission) {
    if (this.ignoreCaseAndPunc) {
      return;
    }
    const spacingBeforePunctuationMatch = spacingBeforePunctuation(userSubmission);
    if (spacingBeforePunctuationMatch) {
      return {
        optimal: false,
        feedback: spacingBeforePunctuationMatch.feedback,
        author: 'Punctuation Hint',
        parentID: this.getTopOptimalResponse().key,
        conceptResults: [
          conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
        ],
      };
    }
  }

  checkSpacingAfterCommaMatch(userSubmission) {
    if (this.ignoreCaseAndPunc) {
      return;
    }
    for (let i = 0; i < userSubmission.length; i++) {
      if (userSubmission[i] === ',' && (i + 1 < userSubmission.length)) {
        if (userSubmission[i + 1] !== ' ') {
          return {
            optimal: false,
            feedback: '<p>Revise your work. Always put a space after a <em>comma</em>.</p>',
            author: 'Punctuation Hint',
            parentID: this.getTopOptimalResponse().key,
            conceptResults: [
              conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
            ],
          };
        }
      }
    }
  }

  checkRequiredWordsMatch(userSubmission) {
    if (this.ignoreCaseAndPunc) {
      return;
    } else if (this.getOptimalResponses().length < 3) {
      return;
    }
    return checkForMissingWords(userSubmission, this.getOptimalResponses(), true);
  }

  checkPOSMatch(userSubmission) {
    // get graded responses and convert to POS strings
    const correctPOSTags = this.getGradedResponses().map(
      optimalResponse => qpos.getPartsOfSpeechTags(optimalResponse.text)
    );
    // convert user submission to POS string
    const userPOSTags = qpos.getPartsOfSpeechTags(userSubmission);
    // if user string could be converted to POS tags find response that has the same POS tags
    if (userPOSTags) {
      const matchedResponse = _.find(this.getGradedResponses(), (optimalResponse, index) => {
        if (optimalResponse.parentID) {
          return false;
        } else if (correctPOSTags[index]) {
          if (JSON.stringify(correctPOSTags[index]) === JSON.stringify(userPOSTags)) {
            // this will return the response object
            return true;
          }
        }
      });
      if (matchedResponse) {
        const returnValue = {
          optimal: matchedResponse.optimal,
          parentID: matchedResponse.key,
          feedback: matchedResponse.feedback,
          author: 'Parts of Speech',
        };
        if (matchedResponse.conceptResults) {
          returnValue.conceptResults = matchedResponse.conceptResults;
        }
        return returnValue;
      }
    }
  }

  checkMLMatch(userSubmission, returnValue, utl) {
    let options = {
      method: 'POST',
      uri: `${process.env.QUILL_CMS}/fragments/is_sentence`,
      form: {
        text: userSubmission
      },
    };
    request(options)
      .then((parsedBody) => {
        // POST succeeded...
        // what is this doing???
        if (JSON.parse(parsedBody).text > 0.5) {
          returnValue.response = Object.assign({}, returnValue.response, {
            optimal: true,
            parentID: this.getTopOptimalResponse().key,
            feedback: "That's a strong sentence!",
            author: 'Parts of Speech',
          });

        } else {
          returnValue.response = Object.assign({}, returnValue.response, {
            optimal: false,
            parentID: this.getTopOptimalResponse().key,
            feedback: "Revise your work. A complete sentence must have an action word and a person or thing doing the action.",
            author: 'Parts of Speech',
          });
        }
        utl.updateResRes(returnValue, utl.key, utl.attempts, utl.dispatch, );
        utl.updateAttempts(returnValue);
        utl.setState({ checkAnswerEnabled: true, });
        utl.handleAttemptSubmission();
      })
      .catch((err) => {
        // POST failed...
        // to do, use Sentry to capture error
        returnValue.found = false;
        utl.updateResRes(returnValue, utl.key, utl.attempts, utl.dispatch, );
        utl.updateAttempts(returnValue);
        utl.setState({ checkAnswerEnabled: true, });
        utl.handleAttemptSubmission();
      });
  }
}

function getMinMaxFeedback(min, max) {
  if (min === max) {
    if (min === 1) {
      return 'Revise your work. Add one word to the prompt to make the sentence complete.';
    }
    return `Revise your work. Add ${constants.NUMBERS_AS_WORDS[min]} words to the prompt to make the sentence complete.`;
  }
  return `Revise your work. Add ${constants.NUMBERS_AS_WORDS[min]} to ${constants.NUMBERS_AS_WORDS[max]} words to the prompt to make the sentence complete.`;
}
