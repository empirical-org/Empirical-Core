$(function() {
  var progressReportMapping = {
    '.progress-reports-activities': EC.ActivitiesProgressReport,
    '.progress-reports-concept-categories': EC.ConceptCategoriesProgressReport,
    '.progress-reports-concept-tags': EC.ConceptTagsProgressReport,
    '.progress-reports-concept-students': EC.ConceptTagsStudentsProgressReport,
    '.progress-reports-standards-classrooms': EC.StandardsAllClassroomsProgressReport,
    '.progress-reports-standards-classroom-students': EC.StandardsClassroomStudentsProgressReport,
    '.progress-reports-standards-topics': EC.StandardsTopicsProgressReport,
    '.progress-reports-standards-classroom-topics': EC.StandardsClassroomTopicsProgressReport,
    '.progress-reports-standards-topic-students': EC.StandardsTopicStudentsProgressReport
  };

  _.each(progressReportMapping, function(component, rootNodeSelector) {
    var $el = $(rootNodeSelector);
    var props = {
      sourceUrl: $el.data('url')
    };
    if ($el.length) {
      React.render(React.createElement(component, props), $el[0]);
    }
  });
});