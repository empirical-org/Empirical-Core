import { Action } from "redux";
import { v4 as uuid4 } from "uuid";
import { ActionTypes } from "../actions/actionTypes";

import { FeedbackObject } from '../interfaces/feedback'

export interface SessionReducerState {
  sessionID: string
  submittedResponses: { [key: string]: FeedbackObject[] }|{}
}

type SessionAction = Action & { promptID: string } & { feedbackObj: FeedbackObject }

export default (
    currentState: SessionReducerState = {
      // Currently we want to initialize a random session for each
      // page load
      sessionID: uuid4(),
      submittedResponses: {}
    },
    action: SessionAction
) => {
    switch (action.type) {
      case ActionTypes.RECORD_FEEDBACK:
        const { promptID, feedbackObj, } = action
        const submittedResponsesForPrompt = currentState.submittedResponses[promptID] || []
        submittedResponsesForPrompt.push(feedbackObj)
        const newResponses = Object.assign({}, currentState.submittedResponses, { [promptID]: submittedResponsesForPrompt })
        return Object.assign({}, currentState, { submittedResponses: newResponses });
      default:
        return currentState;
    }
};
