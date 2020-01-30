import * as request from 'request';

import { ActionTypes } from './actionTypes'

export const getActivity = (activityUID: string) => {
  return (dispatch: Function) => {
    // TODO put this endpoint back in place once error is fixed
    // const activityUrl = `https://comprehension-247816.appspot.com/activities/${activityUID}`
    const activityUrl = `https://comprehension-dummy-data.s3.us-east-2.amazonaws.com/activities/${activityUID}.json`
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
