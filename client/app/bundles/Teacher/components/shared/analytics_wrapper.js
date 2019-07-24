import React from 'react';

export default function () {
  let segmentAnalyticsPresent;
  if (typeof analytics === 'undefined') {
    segmentAnalyticsPresent = false;
  } else {
    segmentAnalyticsPresent = true;
  }

  const whenAnalyticsNotDefined = function () {
    console.log('not tracking segment analytics because its not defined');
  };

  this.track = function (event, data) {
    if (segmentAnalyticsPresent) {
      analytics.track(event, data);
    } else {
      whenAnalyticsNotDefined();
    }
  };
}
