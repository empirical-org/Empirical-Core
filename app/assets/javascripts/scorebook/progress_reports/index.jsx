$(function() {
  if ($('.progress-reports-activities').length) { // Only if we're on this page
    React.render(React.createElement(EC.ActivitiesProgressReport), $('.progress-reports-activities')[0]);
  }

  if ($('.progress-reports-sections').length) {
    React.render(React.createElement(EC.SectionsProgressReport), $('.progress-reports-sections')[0]);
  }

  var $topicsRootNode = $('.progress-reports-topics');
  if ($topicsRootNode.length) {
    var props = {
      sourceUrl: $topicsRootNode.data('url')
    };
    React.render(React.createElement(EC.TopicsProgressReport, props), $topicsRootNode[0]);
  }

  var $conceptCategoriesRootNode = $('.progress-reports-concept-categories');
  if ($conceptCategoriesRootNode.length) {
    var props = {
      sourceUrl: $conceptCategoriesRootNode.data('url')
    };

    React.render(React.createElement(EC.ConceptCategoriesProgressReport, props), $conceptCategoriesRootNode[0]);
  }
});