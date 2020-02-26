import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";

import { FeedbackObject } from '../interfaces/feedback'

export interface SessionReducerState {
  submittedResponses: { [key: string]: FeedbackObject[] }|{}
}

// TODO replace with better UID for the session
const sessionID = String(Math.floor(Math.random() * 10000000000000))

type SessionAction = Action & { promptID: string } & { feedbackObj: FeedbackObject }

export default (
    currentState: SessionReducerState = { submittedResponses: {}, sessionID},
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
