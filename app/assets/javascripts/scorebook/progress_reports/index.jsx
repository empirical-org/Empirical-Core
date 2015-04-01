$(function() {
  var progressReportMapping = {
    '.progress-reports-activities': EC.ActivitiesProgressReport,
    '.progress-reports-sections': EC.SectionsProgressReport,
    '.progress-reports-topics': EC.TopicsProgressReport,
    '.progress-reports-concept-categories': EC.ConceptCategoriesProgressReport,
    '.progress-reports-concept-tags': EC.ConceptTagsProgressReport,
    '.progress-reports-concept-students': EC.ConceptTagsStudentsProgressReport,
    '.progress-reports-topic-students': EC.TopicsStudentsProgressReport,
    '.progress-reports-standards-classrooms': EC.StandardsAllClassroomsProgressReport,
    '.progress-reports-standards-classroom-students': EC.StandardsClassroomStudentsProgressReport
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