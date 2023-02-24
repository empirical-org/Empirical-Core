import { ActionTypes } from './actionTypes'
import { TrackAnalyticsEvent } from './analytics'

import { Events } from '../modules/analytics'
import { requestGet, } from '../../../modules/request/index'

export const getActivity = (sessionID: string, activityUID: string) => {
  return async (dispatch: Function) => {

    dispatch(TrackAnalyticsEvent(Events.EVIDENCE_ACTIVITY_STARTED, {
      activityID: activityUID,
      sessionID: sessionID
    }));

    const activityUrl = `${import.meta.env.VITE_DEFAULT_URL}/api/v1/evidence/activities/${activityUID}`

    await requestGet(activityUrl, (body) => {
      if (body) {
        dispatch({ type: ActionTypes.RECEIVE_ACTIVITY_DATA, data: body, });
      } else {
        dispatch({ type: ActionTypes.NO_ACTIVITY_FOUND })
      }
    })
  }
}
