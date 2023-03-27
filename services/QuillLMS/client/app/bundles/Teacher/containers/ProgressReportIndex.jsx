import React from 'react'

import ActivitiesProgressReport from '../components/progress_reports/activities_progress_report.jsx'
import ActivitiesScoresByClassroomProgressReport from '../components/progress_reports/activities_scores_by_classroom_progress_report.jsx'
import ConceptsConceptsProgressReport from '../components/progress_reports/concepts_concepts_progress_report.jsx'
import ConceptsStudentsProgressReport from '../components/progress_reports/concepts_students_progress_report.jsx'
import StandardsAllClassroomsProgressReport from '../components/progress_reports/standards_all_classrooms_progress_report'
import StandardsClassroomStandardsProgressReport from '../components/progress_reports/standards_classroom_standards_progress_report.jsx'
import StandardsClassroomStudentsProgressReport from '../components/progress_reports/standards_classroom_students_progress_report.jsx'
import StandardsStandardsProgressReport from '../components/progress_reports/standards_standards_progress_report.jsx'
import StandardsStandardStudentsProgressReport from '../components/progress_reports/standards_standard_students_progress_report.jsx'
import StudentOverview from '../components/progress_reports/student_overview.jsx'
import PremiumBannerBuilder from '../components/scorebook/premium_banners/premium_banner_builder'
import LandingPageContainer from './LandingPageContainer.jsx'

export default class ProgressReportIndex extends React.Component {

  renderContent = () => {
    const { currentUser, premiumStatus, classrooms, } = this.props

    const path = window.location.pathname;
    const shouldHaveBanner = !path.includes('/landing_page') && !path.includes('diagnostic_report');

    const props = {
      sourceUrl: `${path}.json`,
      premiumStatus,
      currentUser,
      classrooms
    };

    const progressReportMapping = {
      'progress-reports-activities': <ActivitiesProgressReport {...props} />,
      'progress-reports-standards-classrooms': <StandardsAllClassroomsProgressReport {...props} />,
      'progress-reports-standards-classroom-students': <StandardsClassroomStudentsProgressReport {...props} />,
      'progress-reports-standards-standards': <StandardsStandardsProgressReport {...props} />,
      'progress-reports-standards-classroom-standards': <StandardsClassroomStandardsProgressReport {...props} />,
      'progress-reports-standards-standard-students': <StandardsStandardStudentsProgressReport {...props} />,
      'progress-reports-concepts-students': <ConceptsStudentsProgressReport {...props} />,
      'progress-reports-concepts-concepts': <ConceptsConceptsProgressReport {...props} />,
      'progress-reports-landing-page-container': <LandingPageContainer {...props} />,
      'progress-reports-activities-scores-by-classroom': <ActivitiesScoresByClassroomProgressReport {...props} />,
      'progress-reports-student-overview': <StudentOverview {...props} />,
    };

    let component

    Object.keys(progressReportMapping).forEach(className => {
      const el = document.getElementsByClassName(className)[0]
      if (el) {
        component = progressReportMapping[className]
      }
    });

    const containerStyle = component ? 'gray-background-accommodate-footer' : ''

    return (
      <div className={containerStyle}>
        {shouldHaveBanner && <PremiumBannerBuilder originPage="report" />}
        {component}
      </div>
    )
  };


  render() {
    return this.renderContent()
  }
}
