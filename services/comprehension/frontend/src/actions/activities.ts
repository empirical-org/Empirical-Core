import * as request from 'request';

import { ActionTypes } from './actionTypes'

export const getActivity = (activityUID: string) => {
  return (dispatch: Function) => {
    const activityUrl = `https://comprehension-247816.appspot.com/activities/${activityUID}`
    request.get(activityUrl, (e, r, body) => {
      const activity = JSON.parse(body)
      if (activity) {
        dispatch({ type: ActionTypes.RECEIVE_ACTIVITY_DATA, data: activity, });
      } else {
        dispatch({ type: ActionTypes.NO_ACTIVITY_FOUND })
      }
    })
  }
}
