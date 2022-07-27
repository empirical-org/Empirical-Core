import * as request from 'request';

import { ActionTypes } from './actionTypes'
import { TrackAnalyticsEvent } from './analytics'

import { Events } from '../modules/analytics'

export const getActivity = (sessionID: string, activityUID: string) => {
  return async (dispatch: Function) => {

    dispatch(TrackAnalyticsEvent(Events.EVIDENCE_ACTIVITY_STARTED, {
      activityID: activityUID,
      sessionID: sessionID
    }));

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
