import * as request from 'request';

import { Event } from '../modules/analytics/event_definitions'
import { Events, SegmentAnalytics } from '../modules/analytics'

export const TrackAnalyticsEvent = (event: Event, params: Object) => {
  SegmentAnalytics.track(event, params);
}

export const Events
