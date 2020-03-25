import React from 'react'

import ActivitiesProgressReport from '../components/progress_reports/activities_progress_report.jsx'
import StandardsAllClassroomsProgressReport from '../components/progress_reports/standards_all_classrooms_progress_report.jsx'
import StandardsClassroomStudentsProgressReport from '../components/progress_reports/standards_classroom_students_progress_report.jsx'
import StandardsTopicsProgressReport from '../components/progress_reports/standards_topics_progress_report.jsx'
import StandardsClassroomTopicsProgressReport from '../components/progress_reports/standards_classroom_topics_progress_report.jsx'
import StandardsTopicStudentsProgressReport from '../components/progress_reports/standards_topic_students_progress_report.jsx'
import ConceptsStudentsProgressReport from '../components/progress_reports/concepts_students_progress_report.jsx'
import ConceptsConceptsProgressReport from '../components/progress_reports/concepts_concepts_progress_report.jsx'
import PremiumBannerBuilder from '../components/scorebook/premium_banners/premium_banner_builder'
import LandingPageContainer from './LandingPageContainer.jsx'
import ActivitiesScoresByClassroomProgressReport from '../components/progress_reports/activities_scores_by_classroom_progress_report.jsx'
import RealTimeProgressReport from '../components/progress_reports/real_time_progress_report.jsx'
import StudentOverview from '../components/progress_reports/student_overview.jsx'
import { requestGet } from '../../../modules/request';

export default class ProgressReportIndex extends React.Component {

  renderContent = () => {
    const { currentUser, } = this.props

    const path = window.location.pathname;
    const shouldHaveBanner = !path.includes('/landing_page') && !path.includes('diagnostic_report');

    const progressReportMapping = {
      'progress-reports-activities': ActivitiesProgressReport,
      'progress-reports-standards-classrooms': StandardsAllClassroomsProgressReport,
      'progress-reports-standards-classroom-students': StandardsClassroomStudentsProgressReport,
      'progress-reports-standards-topics': StandardsTopicsProgressReport,
      'progress-reports-standards-classroom-topics': StandardsClassroomTopicsProgressReport,
      'progress-reports-standards-topic-students': StandardsTopicStudentsProgressReport,
      'progress-reports-concepts-students': ConceptsStudentsProgressReport,
      'progress-reports-concepts-concepts': ConceptsConceptsProgressReport,
      'progress-reports-landing-page-container': LandingPageContainer,
      'progress-reports-activities-scores-by-classroom': ActivitiesScoresByClassroomProgressReport,
      'progress-reports-real-time': RealTimeProgressReport,
      'progress-reports-student-overview': StudentOverview,
    };

    let component

    Object.keys(progressReportMapping).forEach(className => {
      const el = document.getElementsByClassName(className)[0]
      if (el) {
        requestGet('/teachers/classrooms/premium.json', (data) => {
          const props = {
            sourceUrl: path,
            premiumStatus: data.hasPremium,
            currentUser,
          };
          const componentName = progressReportMapping[el]
          component = <componentName {...props} />
        });
      }
    });

    return (<div>
      {shouldHaveBanner ? <PremiumBannerBuilder /> : null}
      {component}
    </div>)
  };


  render() {
    return this.renderContent()
   }
 }
