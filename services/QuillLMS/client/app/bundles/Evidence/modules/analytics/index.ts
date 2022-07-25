import { Event } from './event_definitions';
import Events from './events';


class SegmentAnalytics {
  analytics(): object {
    return window.analytics
  }

  track(event: Event, properties?: object): boolean {
    try {
      // Make sure that the event reference is one that's defined
      if (!event) {
        throw new Error('The event referenced does not exist.');
      }

      // Validate that required properties are present
      this.validateEvent(event, properties);

      // Check to make sure that we have access to the analytics global
      if (!this.analytics()) {
        throw new Error(`Error sending event '${event.name}'.  SegmentAnalytics was instantiated before an instance of window.analytics could be found to connect to.`);
      }
    } catch(e) {
      this.reportError(e);
      return false;
    }

    const eventProperties = Object.assign(properties, this.getDefaultProperties());

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
