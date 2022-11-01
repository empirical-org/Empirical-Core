import { Action } from "redux";
import { v4 as uuid4 } from "uuid";

import { ActionTypes } from "../actions/actionTypes";
import { FeedbackObject } from '../interfaces/feedback';
import getParameterByName from '../helpers/getParameterByName';
import { READ_PASSAGE_STEP_NUMBER } from '../../Shared/index'

export interface SessionReducerState {
  sessionID: string
  submittedResponses: { [key: string]: FeedbackObject[] }|{}
  activeStep: number,
  explanationSlidesCompleted: boolean,
  activityIsComplete: boolean
}

type SessionAction = Action & {
  promptID: string,
  feedbackObj: FeedbackObject,
  sessionID: string,
  submittedResponses: SessionReducerState["submittedResponses"]
  activeStep: number,
  explanationSlidesCompleted: boolean,
  activityIsComplete: boolean
}

const shouldSkipToPrompts = window.location.href.includes('turk') || window.location.href.includes('skipToPrompts') || window.location.href.includes('skipToStep')
const activityCompletionCount = parseInt(getParameterByName('activities', window.location.href)) || 0;
const ACTIVITY_COMPLETION_MAXIMUM_FOR_ONBOARDING = 3;

export default (
  currentState: SessionReducerState = {
    // Currently we want to initialize a random session for each
    // page load
    sessionID: uuid4(),
    submittedResponses: {},
    activeStep: shouldSkipToPrompts ? parseInt(getParameterByName('skipToStep', window.location.href)) || READ_PASSAGE_STEP_NUMBER + 1 : READ_PASSAGE_STEP_NUMBER,
    explanationSlidesCompleted: shouldSkipToPrompts || (activityCompletionCount > ACTIVITY_COMPLETION_MAXIMUM_FOR_ONBOARDING),
    activityIsComplete: false
  },
  action: SessionAction
) => {
  switch (action.type) {
    case ActionTypes.SET_ACTIVITY_SESSION_ID:
      const { sessionID, } = action
      return Object.assign({}, currentState, { sessionID });
    case ActionTypes.SESSION_HAS_NO_DATA:
      return Object.assign({}, currentState, { hasReceivedData: true });
    case ActionTypes.SET_SUBMITTED_RESPONSES:
      const { submittedResponses, } = action
      return Object.assign({}, currentState, { explanationSlidesCompleted: true, submittedResponses, hasReceivedData: true });
    case ActionTypes.RECORD_FEEDBACK:
      const { promptID, feedbackObj, } = action
      const submittedResponsesForPrompt = currentState.submittedResponses[promptID] || []
      submittedResponsesForPrompt.push(feedbackObj)
      const newResponses = Object.assign({}, currentState.submittedResponses, { [promptID]: submittedResponsesForPrompt })
      return Object.assign({}, currentState, { submittedResponses: newResponses });
    case ActionTypes.SET_ACTIVE_STEP:
      const { activeStep } = action
      return Object.assign({}, currentState, { activeStep });
    case ActionTypes.SET_EXPLANATIONS_SLIDES_COMPLETED:
      const { explanationSlidesCompleted } = action
      return Object.assign({}, currentState, { explanationSlidesCompleted });
    case ActionTypes.SET_ACTIVITY_IS_COMPLETE_FOR_SESSION:
      const { activityIsComplete } = action
      return Object.assign({}, currentState, { activityIsComplete  });
    default:
      return currentState;
  }
};
