import _ from 'underscore';
import generateFeedbackString from './generateFeedbackString.js';
import {
  incrementResponseCount,
  submitResponse,
  submitResponseImmediate,
} from '../../actions/responses.js';
import { hashToCollection } from '../../../Shared/index';


const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};

interface UpdateResponseResourceParams {
  response: any;
  questionID: any;
  attempts: any;
  dispatch: () => void;
  playQuestion?: any;
  requestSynchronously?: boolean
}

export default function updateResponseResource(params: UpdateResponseResourceParams)  {
  let previousAttempt;
  const preAtt = getLatestAttempt(params.attempts);
  if (preAtt) { previousAttempt = getLatestAttempt(params.attempts).response; }
  const prid = previousAttempt ? previousAttempt.key : undefined;
  const isFirstAttempt = !preAtt;
  const submitFunction = params.requestSynchronously ? submitResponseImmediate : submitResponse

  params.dispatch(
    submitFunction(params.response, prid, isFirstAttempt)
  );
}
