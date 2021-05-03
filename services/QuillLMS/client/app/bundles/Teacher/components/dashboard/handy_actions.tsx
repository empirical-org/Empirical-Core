import * as React from 'react';

import {
  searchMapIcon,
  clipboardCheckIcon,
  tableCheckIcon,
  accountViewIcon,
  giftIcon,
  groupAccountIcon,
  googleClassroomIcon,
} from '../../../Shared/index'

const HandyAction = ({ icon, text, link, }) => (
  <a className="handy-action focus-on-light" href={link}>
    <img alt={icon.alt} src={icon.src} />
    <span>{text}</span>
  </a>
)

const HandyActions = ({ linkedToClever, }) => (
  <section className="handy-actions">
    <h2>Handy actions</h2>
    <HandyAction icon={searchMapIcon} link="/assign/activity-library" text="Explore activity library" />
    <HandyAction icon={clipboardCheckIcon} link="/assign/diagnostic" text="Assign a diagnostic" />
    <HandyAction icon={tableCheckIcon} link="/teachers/classrooms/scorebook" text="View activity summary report" />
    <HandyAction icon={accountViewIcon} link="/teachers/classrooms?modal=view-as-student" text="View as a student" />
    <HandyAction icon={giftIcon} link="/referrals" text="Refer a teacher" />
    <HandyAction icon={groupAccountIcon} link="/teachers/classrooms/new" text="Add a class" />
    {!linkedToClever && <HandyAction icon={googleClassroomIcon} link="/teachers/classrooms?modal=google-classroom" text="Import classes from Google" />}
  </section>
)

export default HandyActions
