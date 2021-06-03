import React from 'react';

import { requestGet } from '../../../modules/request';
import WelcomeModal from '../components/dashboard/welcome_modal'
import OnboardingChecklist from '../components/dashboard/onboarding_checklist'
import DiagnosticMini from '../components/dashboard/diagnostic_mini'
import LessonsMini from '../components/dashboard/lessons_mini'
import ActivityFeed from '../components/dashboard/activity_feed'
import HandyActions from '../components/dashboard/handy_actions'
import DailyTinyTip from '../components/dashboard/daily_tiny_tip'
import TeacherCenterHighlights from '../components/dashboard/teacher_center_highlights'
import CollegeBoard from '../components/dashboard/college_board'
import KeyMetrics from '../components/dashboard/key_metrics'
import useWindowSize from '../../Shared/hooks/useWindowSize'
import { Spinner, } from '../../Shared/index'

const MAX_VIEW_WIDTH_FOR_MOBILE = 1103

const Dashboard = ({ onboardingChecklist, firstName, mustSeeModal, linkedToClever, featuredBlogPosts, }) => {
  const size = useWindowSize();
  const onMobile = () => size.width <= MAX_VIEW_WIDTH_FOR_MOBILE

  const [showWelcomeModal, setShowWelcomeModal] = React.useState(mustSeeModal)

  function closeWelcomeModal() { setShowWelcomeModal(false) }

  if (!onboardingChecklist.every(obj => obj.checked)) {
    return (<div className="dashboard">
      {showWelcomeModal && <WelcomeModal close={closeWelcomeModal} size={size} />}
      <OnboardingChecklist firstName={firstName} onboardingChecklist={onboardingChecklist} />
    </div>)
  }

  const [metrics, setMetrics] = React.useState(null)
  const [diagnostics, setDiagnostics] = React.useState(null);
  const [lessons, setLessons] = React.useState(null);
  const [activityFeed, setActivityFeed] = React.useState(null)
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getMetrics();
    getDiagnostics()
    getLessons()
  }, []);

  React.useEffect(() => {
    if (metrics && diagnostics && lessons && loading) {
      setLoading(false)
    }
  }, [metrics, diagnostics, lessons, activityFeed])

  function getMetrics() {
    requestGet('/teacher_dashboard_metrics',
      (data) => {
        setMetrics(data);
      }
    )
  }

  function getDiagnostics() {
    requestGet('/teachers/diagnostic_info_for_dashboard_mini',
      (data) => {
        setDiagnostics(data.units);
      }
    )
  }

  function getLessons() {
    requestGet('/teachers/lessons_info_for_dashboard_mini',
      (data) => {
        setLessons(data.units);
      }
    )
  }

  function getActivityFeed() {
    requestGet('/teachers/activity_feed',
      (response) => {
        setActivityFeed(response.data);
      }
    )
  }

  if (loading) {
    return (<div className="dashboard">
      <div className="post-checklist-container loading">
        <Spinner />
      </div>
    </div>)
  }

  return (<div className="dashboard">
    <div className="post-checklist-container">
      <main>
        <KeyMetrics firstName={firstName} metrics={metrics} />
        <DiagnosticMini diagnostics={diagnostics} onMobile={onMobile()} />
        <LessonsMini lessons={lessons} onMobile={onMobile()} />
      </main>
      <aside>
        <HandyActions linkedToClever={linkedToClever} />
        <DailyTinyTip />
        <TeacherCenterHighlights featuredBlogPosts={featuredBlogPosts} />
        <CollegeBoard />
      </aside>
    </div>
  </div>)

}

export default Dashboard
