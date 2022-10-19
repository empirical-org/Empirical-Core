import * as React from 'react';

import { requestGet } from '../../../modules/request';
import WelcomeModal from '../components/dashboard/welcome_modal'
import DemoModal from '../components/dashboard/demo_modal'
import OnboardingChecklist from '../components/dashboard/onboarding_checklist'
import DiagnosticMini from '../components/dashboard/diagnostic_mini'
import LessonsMini from '../components/dashboard/lessons_mini'
import ActivityFeed from '../components/dashboard/activity_feed'
import HandyActions from '../components/dashboard/handy_actions'
import DailyTinyTip from '../components/dashboard/daily_tiny_tip'
import TeacherCenterHighlights from '../components/dashboard/teacher_center_highlights'
import CollegeBoard from '../components/dashboard/college_board'
import KeyMetrics from '../components/dashboard/key_metrics'
import EvidencePromotionCard from '../components/dashboard/evidence_promotion_card'
import DemoOnboardingTour, { DEMO_ONBOARDING_DASHBOARD, } from '../components/shared/demo_onboarding_tour'
import useWindowSize from '../../Shared/hooks/useWindowSize'
import { Spinner, } from '../../Shared/index'

const MAX_VIEW_WIDTH_FOR_MOBILE = 1103

const Dashboard = ({ onboardingChecklist, firstName, mustSeeModal, linkedToClever, featuredBlogPosts, showDiagnosticPromotionCard, }) => {
  const size = useWindowSize();
  const className = "dashboard white-background-accommodate-footer"
  const onMobile = () => size.width <= MAX_VIEW_WIDTH_FOR_MOBILE

  const [showWelcomeModal, setShowWelcomeModal] = React.useState(mustSeeModal)
  const [showDemoModal, setShowDemoModal] = React.useState(false)

  function closeWelcomeModal() { setShowWelcomeModal(false) }
  function closeDemoModal() { setShowDemoModal(false) }

  if (!onboardingChecklist.every(obj => obj.checked)) {
    return (
      <div className={className}>
        {showWelcomeModal && <WelcomeModal close={closeWelcomeModal} size={size} />}
        {showDemoModal && <DemoModal close={closeDemoModal} size={size} />}
        <OnboardingChecklist firstName={firstName} onboardingChecklist={onboardingChecklist} />
      </div>
    )
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
    getActivityFeed()
  }, []);

  React.useEffect(() => {
    if (metrics && diagnostics && lessons && activityFeed && loading) {
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
    return (
      <div className={className}>
        <div className="post-checklist-container loading">
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="post-checklist-container">
        <DemoOnboardingTour
          pageKey={DEMO_ONBOARDING_DASHBOARD}
        />
        {showDemoModal && <DemoModal close={closeDemoModal} size={size} />}
        <main>
          <EvidencePromotionCard />
          <KeyMetrics firstName={firstName} metrics={metrics} />
          <DiagnosticMini diagnostics={diagnostics} onMobile={onMobile()} />
          <LessonsMini lessons={lessons} onMobile={onMobile()} />
          <ActivityFeed activityFeed={activityFeed} onMobile={onMobile()} />
        </main>
        <aside>
          <HandyActions linkedToClever={linkedToClever} setShowDemoModal={setShowDemoModal} />
          <DailyTinyTip />
          <TeacherCenterHighlights featuredBlogPosts={featuredBlogPosts} />
          <CollegeBoard />
        </aside>
      </div>
    </div>
  )

}

export default Dashboard
