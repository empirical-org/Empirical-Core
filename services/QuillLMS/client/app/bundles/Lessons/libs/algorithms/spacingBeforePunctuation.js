import _ from 'underscore';

const subStrings = [
  ' ,',
  ' .',
  ' ;',
  ' !',
  ' ?'
];

const subStringsToText = {
  ' ,': 'comma',
  ' .': 'period',
  ' ;': 'semi-colon',
  ' !': 'exclamation mark',
  ' ?': 'question mark',
};

export function getFeedbackForPunc(punc) {
  const fb = subStringsToText[punc];
  return `<p>Revise your sentence. You don't need to have a space before a <em>${fb}</em>.</p>`;
}

export function checkForSpacingError(userString) {
  return _.find(subStrings, subString => userString.indexOf(subString) !== -1);
}

export function spacingBeforePunctuation(userString) {
  const match = checkForSpacingError(userString);
  return (match ? { feedback: getFeedbackForPunc(match), } : undefined);
}
