import { Event } from './event_definitions';
import Events from './events';

import getParameterByName from '../../helpers/getParameterByName';
import { fetchUserIdsForSession } from '../../../Shared/utils/userAPIs';
import { isTrackableStudentEvent, UserIdsForEvent } from '../../../Shared';

class SegmentAnalytics {
  analytics(): object {
    return window.analytics
  }

  async track(event: Event, properties?: object) {
    const sessionID = getParameterByName('session', window.location.href)
    const idData = await fetchUserIdsForSession(sessionID)
    console.log("🚀 ~ file: index.ts ~ line 16 ~ SegmentAnalytics ~ track ~ idData", idData)

    console.log("🚀 ~ file: index.ts ~ line 19 ~ SegmentAnalytics ~ track ~ isTrackableStudentEvent(idData)", isTrackableStudentEvent(idData))
    if(!isTrackableStudentEvent(idData)) { return }

    try {
      // Make sure that the event reference is one that's defined
      if (!event) {
        throw new Error('The event referenced does not exist.');
      }

      // Validate that required properties are present
      this.validateEvent(event, properties);
      console.log("🚀 ~ file: index.ts ~ line 29 ~ SegmentAnalytics ~ track ~ this.validateEvent(event, properties)", this.validateEvent(event, properties))

      // Check to make sure that we have access to the analytics global
      console.log("🚀 ~ file: index.ts ~ line 33 ~ SegmentAnalytics ~ track ~ this.analytics()", this.analytics())
      if (!this.analytics()) {
        throw new Error(`Error sending event '${event.name}'.  SegmentAnalytics was instantiated before an instance of window.analytics could be found to connect to.`);
      }
    } catch(e) {
      this.reportError(e);
      return false;
    }

    const eventProperties = Object.assign(this.formatProperties(properties, idData), this.getDefaultProperties());
    console.log("🚀 ~ file: index.ts ~ line 42 ~ SegmentAnalytics ~ track ~ eventProperties", eventProperties)
    this.analytics().track(event.name, eventProperties);
    return true;
  }

  validateEvent (event: Event, properties?: object): void {
    if (properties === undefined) {
      properties = {};
    }
    if (event.requiredProperties) {
      let passedEventProperties = Object.keys(properties);
      event.requiredProperties.forEach((p) => {
        if (passedEventProperties.indexOf(p) == -1) {
          throw new Error(`Can not track event "${event.name}" without required property "${p}".`);
        }
      });
    }
  }

  getDefaultProperties(): object {
    return {
      path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
      referrer: document.referrer,
    };
  }

  formatProperties(properties, idData: UserIdsForEvent) {
    const { teacherId, studentId } = idData
    return {
      ...properties,
      user_id: teacherId,
      properties: {
        student_id: studentId
      }
    }
  }

  reportError(e: Error): void {
    // placeholder for actual error reporting
    // to do - do something with this error
  }
}

const segmentInstance = new SegmentAnalytics();

export {
  segmentInstance as SegmentAnalytics,
  Events,
};
