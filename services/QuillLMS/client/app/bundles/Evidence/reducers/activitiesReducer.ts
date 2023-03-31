import { Action } from "redux";
import { ActionTypes } from "../actions/actionTypes";

import { Activity } from '../interfaces/activities'

export interface ActivitiesReducerState {
  hasReceivedData: boolean;
  currentActivity?: Activity;
  error?: string;
}

type ActivityAction = Action & { data: any } & { cid: string }

export default (
  currentState = { hasReceivedData: false },
  action: ActivityAction
) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_ACTIVITY_DATA:
      return Object.assign({}, currentState, { currentActivity: action.data, hasReceivedData: true });
    case ActionTypes.NO_ACTIVITY_FOUND:
      return Object.assign({}, currentState, { error: 'No activity found.'})
    case ActionTypes.RECEIVE_TOPIC_OPTIMAL_DATA:
      return Object.assign({}, currentState, { topicOptimalData: action.data });
    default:
      return currentState;
  }
};
