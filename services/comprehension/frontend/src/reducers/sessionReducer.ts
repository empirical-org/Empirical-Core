import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";

export interface ActivitiesReducerState {
  responses: { [key:number]: Array<any> }
}

type SessionAction = Action & { prompt_id: number } & { feedback: any }

export default (
    currentState = { responses: {} },
    action: SessionAction
) => {
    switch (action.type) {
      case ActionTypes.RECORD_FEEDBACK:
        const responsesForPrompt = currentState.responses[action.prompt_id] || []
        responsesForPrompt.push(action.feedback)
        const newResponses = Object.assign({}, currentState.responses, { [action.prompt_id]: responsesForPrompt })
        return Object.assign({}, currentState, { responses: newResponses });
      default:
        return currentState;
    }
};
