import * as request from 'request';

import { ActionTypes } from './actionTypes'

export const getActivity = (sessionID: string, activityUID: string) => {
  return async (dispatch: Function) => {

    const activityUrl = `${process.env.DEFAULT_URL}/api/v1/evidence/activities/${activityUID}`

    await request.get(activityUrl, (e, r, body) => {
      const activity = JSON.parse(body)
      if (activity) {
        dispatch({ type: ActionTypes.RECEIVE_ACTIVITY_DATA, data: activity, });
      } else {
        dispatch({ type: ActionTypes.NO_ACTIVITY_FOUND })
      }
    })
  }
}
