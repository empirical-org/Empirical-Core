$(function() {
  if ($('.progress-reports-activities').length) { // Only if we're on this page
    React.render(React.createElement(EC.ActivitiesProgressReport), $('.progress-reports-activities')[0]);
  }

  if ($('.progress-reports-sections').length) {
    React.render(React.createElement(EC.SectionsProgressReport), $('.progress-reports-sections')[0]);
  }
});