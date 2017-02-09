import { hashToCollection } from '../../libs/hashToCollection';
import _ from 'underscore';
import generateFeedbackString from './generateFeedbackString.js';
import {
  incrementResponseCount,
  submitNewResponse,
  findResponseByText
} from '../../actions/responses.js';

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};

export default function updateResponseResource(returnValue, questionID, attempts, dispatch, playQuestion) {
  let previousAttempt;

  const preAtt = getLatestAttempt(attempts);
  if (preAtt) { previousAttempt = getLatestAttempt(attempts).response; }
  const prid = previousAttempt ? previousAttempt.key : undefined;

  if (returnValue.found && returnValue.response.key) {
    dispatch(
      incrementResponseCount(questionID, returnValue.response.key, prid)
    );
  } else {
    incrementOrCreateResponse(questionID, returnValue, prid, dispatch);
  }
}

export function incrementOrCreateResponse(questionID, returnValue, prid, dispatch) {
  const callback = (response) => {
    if (response) {
      dispatch(
        incrementResponseCount(questionID, response.key, prid)
      );
    } else {
      dispatch(
        submitNewResponse(returnValue.response, prid)
      );
    }
  };
  findResponseByText(returnValue.response.text, questionID, callback);
}
