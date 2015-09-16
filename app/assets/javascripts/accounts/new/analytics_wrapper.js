EC.AnalyticsWrapper = function () {

  var segmentAnalyticsPresent;
  if (typeof analytics === 'undefined') {
    segmentAnalyticsPresent = false;
  } else {
    segmentAnalyticsPresent = true;
  }

  this.track = function (event, data) {
    if (segmentAnalyticsPresent) {
      analytics.track(event, data);
    } else {
      console.log('not tracking segment analytics because its not defined');
    }
  };
};