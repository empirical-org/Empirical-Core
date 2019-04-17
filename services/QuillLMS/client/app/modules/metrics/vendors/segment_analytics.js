// Vendor defition required to use Segment in `react-metrics`.
// Cribbed from https://github.com/nfl/react-metrics/blob/5dad20e04cb3cb386fc71341e73708f35e61d965/examples/vendors/GoogleAnalytics.js

import analytics from "./analytics.min";
import Events from "../events.js";

/**
 * Performs the tracking calls to Segment.io.
 * Utilizing Segment IO Analytics Integration.
 *
 * @module SegmentAnalytics
 * @class
 * @internal
 */
class SegmentAnalytics {
    constructor(options = {}) {
        this.name = "Segment.io";
        this._loaded = false;
        this.options = options;
    }
    /**
     *
     * @method pageView
     * @param {String} eventName
     * @param {Object} params
     * @returns {Promise}
     * @internal
     */
    pageView(...args) {
        return this.track(...args);
    }
    user(userId) {
        return new Promise(resolve => {
            this.userId = userId;
            resolve({
                userId
            });
        });
    }
    /**
     *
     * @method track
     * @param {String} eventName
     * @param {Object} params
     * @returns {Promise}
     * @internal
     */
    track(eventName, params) {
        if (!Events.includes(eventName)) {
          let msg = `Attempted to track event "${eventName}" which is not present in the validation list.`;
          // @TODO: Figure out what the appropriate way to surface this error is.
          // Console messages are, by default, reset on page load, so you can easily miss these
          console.error(msg);
          // These are super-disruptive if they make it to a user
          alert(msg);
          // This seems to get swallowed off in promise-land or something
          throw new Error(msg);
        }
        return new Promise((resolve, reject) => {
            this._load()
                .then(() => {
                    this._track(eventName, params);
                    resolve({
                        eventName,
                        params
                    });
                })
                .catch(error => {
                    console.error("Segment.io: Failed to initialize", error);
                    reject(error);
                });
        });
    }
    /**
     *
     * @method _track
     * @param {String} eventName
     * @param {Object} params
     * @protected
     */
    _track(eventName, params) {
        if (eventName === "pageView") {
            analytics.page(params.category, params);
            return;
        }
        analytics.track(eventName, params);
    }
    /**
     *
     * @method _load
     * @protected
     */
    _load() {
        return (
            this._promise ||
            (this._promise = new Promise(resolve => {
                if (this._loaded) {
                    resolve();
                } else {
                    analytics.once("ready", () => {
                        this._loaded = true;
                        resolve();
                    });
                    analytics.initialize({
                        "Segment.io": this.options
                    });
                }
            }))
        );
    }
}

export default SegmentAnalytics;
