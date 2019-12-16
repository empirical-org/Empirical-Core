import * as request from 'request';

import { ActionTypes } from './actionTypes'

export const getActivity = (activityUID: string) => {
  return (dispatch: Function) => {
    request.get(`https://comprehension-dummy-data.s3.us-east-2.amazonaws.com/activities/${activityUID}.json`, (e, r, body) => {
      const activity = JSON.parse(body)
      if (activity) {
        dispatch({ type: ActionTypes.RECEIVE_ACTIVITY_DATA, data: activity, });
      } else {
        dispatch({ type: ActionTypes.NO_ACTIVITY_FOUND })
      }
    })
  }
}
