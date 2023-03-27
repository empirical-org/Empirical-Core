import Events from './events';
import { Event } from './event_definitions';

import { isTrackableStudentEvent } from '../../../Shared';
import { fetchUserIdsForSession } from '../../../Shared/utils/userAPIs';
import { getParameterByName } from '../../libs/getParameterByName';
class SegmentAnalytics {
  analytics: Object;

  constructor() {
    try {
      this.analytics = (<any>window).analytics;
    } catch(e) {
      this.reportError(e);
      this.analytics = null;
    }
  }

  attachAnalytics() {
    try {
      this.analytics = window['analytics'];
    } catch(e) {
      this.reportError(e);
    }
  }

  async track(event: Event, params?: object) {
    const sessionID = getParameterByName('student', window.location.href)
    const idData = await fetchUserIdsForSession(sessionID)

    if(!isTrackableStudentEvent(idData)) { return }

    const { teacherId, studentId } = idData
    const customProperties = {
      ...params,
      event: event.name,
      user_id: teacherId,
      properties: {
        student_id: studentId
      }
    }

    try {
      // Make sure that the event reference is one that's defined
      if (!event) {
        throw new Error('The event referenced does not exist.');
      }

      // Validate that required properties are present
      this.validateEvent(event, customProperties);

      // Check to make sure that we have access to the analytics global
      if (!this.analytics) {
        throw new Error(`Error sending event '${event.name}'.  SegmentAnalytics was instantiated before an instance of window.analytics could be found to connect to.`);
      }
    } catch(e) {
      this.reportError(e);
      return false;
    }

    const eventProperties = Object.assign({...customProperties}, this.getDefaultProperties());
    this.analytics['identify'](teacherId, { event: event.name });
    this.analytics['track'](event.name, eventProperties);
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

  formatCustomProperties(properties: object): object {
    if (typeof properties !== 'object') {
      properties = {};
    }
    return Object.keys(properties).reduce((accumulator, key) => {
      const keysToSkip = ['event', 'user_id', 'properties'];
      let customKeyName = keysToSkip.includes(key) ? key : `custom_${key}`;
      accumulator[customKeyName] = properties[key];
      return accumulator;
    }, {});
  }

  getDefaultProperties(): object {
    return {
      path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
      referrer: document.referrer,
    };
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

