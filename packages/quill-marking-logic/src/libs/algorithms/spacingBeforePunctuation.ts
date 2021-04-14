import * as _ from 'underscore';
import {FeedbackObject} from '../../interfaces'

const subStrings = [
  ' ,',
  ' .',
  ' ;',
  ' !',
  ' ?'
];

const subStringsToText = {
  ' ,': 'a comma',
  ' .': 'a period',
  ' ;': 'a semi-colon',
  ' !': 'an exclamation mark',
  ' ?': 'a question mark',
};

export function getFeedbackForPunc(punc: string):string {
  const fb = subStringsToText[punc];
  return `<p>Revise your sentence. You don't need to have a space before ${fb}.</p>`;
}

export function checkForSpacingError(userString: string):string {
  return _.find(subStrings, subString => userString.indexOf(subString) !== -1);
}

export function spacingBeforePunctuation(userString: string):FeedbackObject|undefined {
  const match = checkForSpacingError(userString);
  return (match ? { feedback: getFeedbackForPunc(match), } : undefined);
}
