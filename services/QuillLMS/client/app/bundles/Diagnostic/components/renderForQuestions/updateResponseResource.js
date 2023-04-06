import {
    submitResponse
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
  const isFirstAttempt = !preAtt;
  dispatch(
    submitResponse(returnValue.response, prid, isFirstAttempt)
  );
}
