import ActivitiesProgressReport from '../components/progress_reports/activities_progress_report.jsx'
import StandardsAllClassroomsProgressReport from '../components/progress_reports/standards_all_classrooms_progress_report.jsx'
import StandardsClassroomStudentsProgressReport from '../components/progress_reports/standards_classroom_students_progress_report.jsx'
import StandardsTopicsProgressReport from '../components/progress_reports/standards_topics_progress_report.jsx'
import StandardsClassroomTopicsProgressReport from '../components/progress_reports/standards_classroom_topics_progress_report.jsx'
import StandardsTopicStudentsProgressReport from '../components/progress_reports/standards_topics_progress_report.jsx'
import ConceptsStudentsProgressReport from '../components/progress_reports/concepts_students_progress_report.jsx'
import ConceptsConceptsProgressReport from '../components/progress_reports/concepts_concepts_progress_report.jsx'
import PremiumBannerBuilder from '../components/scorebook/premium_banners/premium_banner_builder'
import $ from 'jquery'
import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'


var renderRightComponentHack = function() {
  var ele = $('.student-reports-subnav.tab-subnavigation-wrapper');
  if (ele.length > 0) {
    ReactDOM.render(React.createElement(PremiumBannerBuilder), $(ele[0]).next()[0]);
  }

  var progressReportMapping = {
    '.progress-reports-activities': ActivitiesProgressReport,
    '.progress-reports-standards-classrooms': StandardsAllClassroomsProgressReport,
    '.progress-reports-standards-classroom-students': StandardsClassroomStudentsProgressReport,
    '.progress-reports-standards-topics': StandardsTopicsProgressReport,
    '.progress-reports-standards-classroom-topics': StandardsClassroomTopicsProgressReport,
    '.progress-reports-standards-topic-students': StandardsTopicStudentsProgressReport,
    '.progress-reports-concepts-students': ConceptsStudentsProgressReport,
    '.progress-reports-concepts-concepts': ConceptsConceptsProgressReport
  };

  _.each(progressReportMapping, function(component, rootNodeSelector) {
    var $el = $(rootNodeSelector);
    if ($el.length) {
      $.get('/teachers/classrooms/premium.json').done(function(data) {
        var props = {
          sourceUrl: $el.data('url'),
          premiumStatus: data.hasPremium
        };
        ReactDOM.render(React.createElement(component, props), $el[0]);
      });
    }
  });
};

export default React.createClass({

  componentDidMount: function(){
   renderRightComponentHack();
  },


  render: function() {
    return (
      <span/>
    );
   }
 });





// export default React.createClass({
//
//   getInitialState: function(){
//     return({report: null, reportProps: null});
//   },
//
//   correctReport: function() {
//     var progressReportMapping = {
//       '.progress-reports-activities': ActivitiesProgressReport,
//       '.progress-reports-standards-classrooms': StandardsAllClassroomsProgressReport,
//       '.progress-reports-standards-classroom-students': StandardsClassroomStudentsProgressReport,
//       '.progress-reports-standards-topics': StandardsTopicsProgressReport,
//       '.progress-reports-standards-classroom-topics': StandardsClassroomTopicsProgressReport,
//       '.progress-reports-standards-topic-students': StandardsTopicStudentsProgressReport,
//       '.progress-reports-concepts-students': ConceptsStudentsProgressReport,
//       '.progress-reports-concepts-concepts': ConceptsConceptsProgressReport
//     }
//     var that = this;
//     _.each(progressReportMapping, function(component, rootNodeSelector) {
//
//       var $el = $(rootNodeSelector);
//       if ($el.length) {
//         $.get('/teachers/classrooms/premium.json').done(function(data) {
//
//           that.setState({report: <component sourceUrl={$el.data('url')} premiumStatus={data.hasPremium}/>});
//
//         });
//       }
//     });
//   },
//
//   render: function() {
//     var report;
//     if (this.state.report) {
//         report = this.state.report;
//     } else {
//       report = <div>'wtf'</div>
//     }
//     console.log(report)
//     return (
//      {report}
//     )
//    }
//  });
