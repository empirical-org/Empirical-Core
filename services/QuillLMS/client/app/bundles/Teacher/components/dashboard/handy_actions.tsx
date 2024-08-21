import * as React from 'react';

import {
  accountViewIcon,
  clipboardCheckIcon,
  demoViewIcon,
  giftIcon,
  googleClassroomIcon,
  groupAccountIcon,
  searchMapIcon,
  tableCheckIcon,
  globeIcon,
  aiIcon,
} from '../../../Shared/index';
import { requestGet, } from '../../../../modules/request'

const HandyAction = ({ icon, text, link, showNewTag, }) => (
  <a className="handy-action focus-on-light" href={link}>
    <img alt={icon.alt} src={icon.src} />
    <span>{text}</span>
    {showNewTag && <span className="gold-new-tag">NEW</span>}
  </a>
)

const ExploreDemoAction = ({setShowDemoModal}) => (
  <button className="handy-action handy-action-button focus-on-light" onClick={() => setShowDemoModal(true)} type="button">
    <img alt={demoViewIcon.alt} src={demoViewIcon.src} />
    <span>Explore a demo teacher account</span>
  </button>
)

const HandyActions = ({ linkedToClever, setShowDemoModal}) => {
  const [hasAssignedSocialStudiesActivities, setHasAssignedSocialStudiesActivities] = React.useState(false)
  const [hasAssignedScienceActivities, setHasAssignedScienceActivities] = React.useState(false)

  React.useEffect(() => {
    requestGet('/teachers/progress_reports/assigned_content_hub_activities_status',
      ({ has_assigned_science_activities, has_assigned_social_studies_activities, }) => {
        setHasAssignedScienceActivities(has_assigned_science_activities)
        setHasAssignedSocialStudiesActivities(has_assigned_social_studies_activities)
      }
    )
  })

  return(
    <section className="handy-actions">
      <h2>Handy Actions</h2>
      {hasAssignedSocialStudiesActivities && <HandyAction icon={globeIcon} link="/teachers/progress_reports/social-studies/world-history-1200-to-present" showNewTag={true} text="Social Studies Dashboard" /> }
      {hasAssignedScienceActivities && <HandyAction icon={aiIcon} link="/teachers/progress_reports/interdisciplinary-science/building-ai-knowledge" showNewTag={true} text="Interdisciplinary Science Dashboard" /> }
      <HandyAction icon={searchMapIcon} link="/assign/activity-library" text="Explore activity library" />
      <HandyAction icon={clipboardCheckIcon} link="/assign/diagnostic" text="Assign a diagnostic" />
      <HandyAction icon={tableCheckIcon} link="/teachers/classrooms/scorebook" text="View activity summary report" />
      <HandyAction icon={accountViewIcon} link="/teachers/classrooms?modal=view-as-student" text="View as a student" />
      <ExploreDemoAction setShowDemoModal={setShowDemoModal} />
      <HandyAction icon={giftIcon} link="/referrals" text="Refer a teacher" />
      <HandyAction icon={groupAccountIcon} link="/teachers/classrooms/new" text="Add a class" />
      {!linkedToClever && <HandyAction icon={googleClassroomIcon} link="/teachers/classrooms?modal=google-classroom" text="Import classes from Google" />}
    </section>
  )
}

export default HandyActions
