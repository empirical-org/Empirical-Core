import _ from 'underscore';

import generateFeedbackString from './generateFeedbackString.js';

import {
  incrementResponseCount,
  submitResponse,
} from '../../actions/responses.js';
import { hashToCollection } from '../../../Shared/index'

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};

export default function updateResponseResource(returnValue, questionID, attempts, dispatch, playQuestion) {
  let previousAttempt;
  const preAtt = getLatestAttempt(attempts);
  if (preAtt) { previousAttempt = getLatestAttempt(attempts).response; }
  const prid = previousAttempt ? previousAttempt.key : undefined;
  const isFirstAttempt = !preAtt;
  dispatch(
    submitResponse(returnValue.response, prid, isFirstAttempt)
  );
}
