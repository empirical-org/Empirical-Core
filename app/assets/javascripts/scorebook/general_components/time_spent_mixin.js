'use strict';

EC.TimeSpentMixin = {
  displayTimeSpent: function(timeInSeconds, hideGarbageTimes) {
    if (timeInSeconds === null) {
      return '—';
    } else {
      var timeInMinutes = Math.ceil(timeInSeconds / 60);
      if (timeInMinutes > 30 && hideGarbageTimes) {
        return '—';
      } else {
        return timeInMinutes + ' minutes';
      }
    }
  }
};