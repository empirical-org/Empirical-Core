import React from 'react';

import { requestGet } from '../../../modules/request';
import WelcomeModal from '../components/dashboard/welcome_modal'
import OnboardingChecklist from '../components/dashboard/onboarding_checklist'
import ActivityFeed from '../components/dashboard/activity_feed'
import HandyActions from '../components/dashboard/handy_actions'
import DailyTinyTip from '../components/dashboard/daily_tiny_tip'
import TeacherCenterHighlights from '../components/dashboard/teacher_center_highlights'
import CollegeBoard from '../components/dashboard/college_board'

const Dashboard = ({ onboardingChecklist, firstName, mustSeeModal, linkedToClever, featuredBlogPosts, }) => {
  const [showWelcomeModal, setShowWelcomeModal] = React.useState(mustSeeModal)
  const [activityFeed, setActivityFeed] = React.useState(mustSeeModal)

  function closeWelcomeModal() { setShowWelcomeModal(false) }

  if (!onboardingChecklist.every(obj => obj.checked)) {
    return (<div className="dashboard">
      {showWelcomeModal && <WelcomeModal close={closeWelcomeModal} />}
      <OnboardingChecklist firstName={firstName} onboardingChecklist={onboardingChecklist} />
    </div>)
  }


  return (<div className="dashboard">
    <div className="post-checklist-container">
      <main>
        <ActivityFeed />
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
