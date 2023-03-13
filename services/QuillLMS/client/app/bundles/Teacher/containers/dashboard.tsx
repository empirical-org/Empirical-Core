import * as React from 'react';

import { requestGet } from '../../../modules/request';
import WelcomeModal from '../components/dashboard/welcome_modal'
import DemoModal from '../components/dashboard/demo_modal'
import TeacherInfoModal from '../components/dashboard/teacher_info_modal'
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
import ArticleSpotlight from '../components/shared/articleSpotlight';
import { GRAY_ARTICLE_FOOTER_BACKGROUND_COLOR, TEACHER_DASHBOARD_FEATURED_BLOG_POST_ID } from '../constants/featuredBlogPost';

const MAX_VIEW_WIDTH_FOR_MOBILE = 1103

const Dashboard = ({ onboardingChecklist, firstName, mustSeeWelcomeModal, mustSeeTeacherInfoModal, linkedToClever, featuredBlogPosts, showEvidencePromotionCard, subjectAreas, }) => {
  const size = useWindowSize();
  const className = "dashboard white-background-accommodate-footer"
  const onMobile = () => size.width <= MAX_VIEW_WIDTH_FOR_MOBILE

  const [showWelcomeModal, setShowWelcomeModal] = React.useState(mustSeeWelcomeModal)
  const [showTeacherInfoModal, setShowTeacherInfoModal] = React.useState(mustSeeTeacherInfoModal)
  const [showDemoModal, setShowDemoModal] = React.useState(false)

  function closeWelcomeModal() { setShowWelcomeModal(false) }
  function closeDemoModal() { setShowDemoModal(false) }
  function closeTeacherInfoModal() { setShowTeacherInfoModal(false) }

  if (!onboardingChecklist.every(obj => obj.checked)) {
    return (
      <React.Fragment>
        <div className={className}>
          {showWelcomeModal && <WelcomeModal close={closeWelcomeModal} size={size} />}
          {showDemoModal && <DemoModal close={closeDemoModal} size={size} />}
          <OnboardingChecklist firstName={firstName} onboardingChecklist={onboardingChecklist} />
        </div>
        <ArticleSpotlight backgroundColor={GRAY_ARTICLE_FOOTER_BACKGROUND_COLOR} blogPostId={TEACHER_DASHBOARD_FEATURED_BLOG_POST_ID} />
      </React.Fragment>
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
    <React.Fragment>
      <div className={className}>
        <div className="post-checklist-container">
          <DemoOnboardingTour
            pageKey={DEMO_ONBOARDING_DASHBOARD}
          />
          {showDemoModal && <DemoModal close={closeDemoModal} size={size} />}
          {showTeacherInfoModal && <TeacherInfoModal close={closeTeacherInfoModal} subjectAreas={subjectAreas} />}
          <main>
            {showEvidencePromotionCard && <EvidencePromotionCard />}
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
      <ArticleSpotlight backgroundColor={GRAY_ARTICLE_FOOTER_BACKGROUND_COLOR} blogPostId={TEACHER_DASHBOARD_FEATURED_BLOG_POST_ID} />
    </React.Fragment>
  )

}

export default Dashboard
