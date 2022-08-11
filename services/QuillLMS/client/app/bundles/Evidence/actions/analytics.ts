import * as request from 'request';

import { Event } from '../modules/analytics/event_definitions'
import { SegmentAnalytics } from '../modules/analytics'

export const TrackAnalyticsEvent = (event: Event, params?: Object, properties?: Object) => {
  return (dispatch: Function) => {
    SegmentAnalytics.track(event, params, properties);
  }
}
