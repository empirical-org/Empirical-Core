import { SegmentAnalytics } from '../modules/analytics';
import { Event } from '../modules/analytics/event_definitions';

export const TrackAnalyticsEvent = (event: Event, params: Object) => {
  return (dispatch: Function) => {
    SegmentAnalytics.track(event, params);
  }
}