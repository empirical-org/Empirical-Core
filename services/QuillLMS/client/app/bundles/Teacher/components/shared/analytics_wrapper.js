import React from 'react';

export default function () {
  let segmentAnalyticsPresent;
  if (typeof analytics === 'undefined') {
    segmentAnalyticsPresent = false;
  } else {
    segmentAnalyticsPresent = true;
  }

  const whenAnalyticsNotDefined = function () {
    // to do, use Sentry to capture error
  };

  this.track = function (event, data) {
    if (segmentAnalyticsPresent) {
      analytics.track(event, data);
    } else {
      whenAnalyticsNotDefined();
    }
  };
}
