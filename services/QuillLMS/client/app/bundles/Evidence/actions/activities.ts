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

    const activityUrl = `${process.env.DEFAULT_URL}/api/v1/evidence/activities/${activityUID}`

    await requestGet(activityUrl, (body) => {
      if (body) {
        dispatch({ type: ActionTypes.RECEIVE_ACTIVITY_DATA, data: body, });
      } else {
        dispatch({ type: ActionTypes.NO_ACTIVITY_FOUND })
      }
    })
  }
}

export const getTopicOptimalInfo = (activityID: number) => {
  return async (dispatch: Function) => {
    const topicOptimalInfoUrl = `${process.env.DEFAULT_URL}/api/v1/evidence/activities/${activityID}/topic_optimal_info`

    await requestGet(topicOptimalInfoUrl, (body) => {
      if (body) {
        dispatch({ type: ActionTypes.RECEIVE_TOPIC_OPTIMAL_DATA, data: body, });
      }
    })
  }
}
