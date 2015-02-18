$(function() {
  if ($('.progress-reports-activities').length) { // Only if we're on this page
    React.render(React.createElement(EC.ActivitiesProgressReport), $('.progress-reports-activities')[0]);
  }
});