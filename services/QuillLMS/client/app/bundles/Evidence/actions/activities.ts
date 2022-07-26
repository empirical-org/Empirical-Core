import * as request from 'request';

import { ActionTypes } from './actionTypes'
import { TrackAnalyticsEvent } from './analytics'

import { Events } from '../modules/analytics'
import { isTrackableEvent } from '../../Shared';

export const getActivity = (sessionID: string, activityUID: string, idData: { studentId: string, teacherId: string }) => {
  return async (dispatch: Function) => {

    if(isTrackableEvent(idData)) {
      const { studentId, teacherId } = idData;
      dispatch(TrackAnalyticsEvent(Events.COMPREHENSION_ACTIVITY_STARTED, {
        activityID: activityUID,
        sessionID: sessionID,
        user_id: teacherId,
        properties: {
          student_id: studentId
        }
      }));
    }

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
