import * as React from 'react';

import {
  searchMapIcon,
  clipboardCheckIcon,
  tableCheckIcon,
  accountViewIcon,
  demoViewIcon,
  giftIcon,
  groupAccountIcon,
  googleClassroomIcon,
} from '../../../Shared/index'
import { handleHasAppSetting } from "../../../Shared/utils/appSettingAPIs";

const HandyAction = ({ icon, text, link, }) => (
  <a className="handy-action focus-on-light" href={link}>
    <img alt={icon.alt} src={icon.src} />
    <span>{text}</span>
  </a>
)

const ExploreDemoAction = ({setShowDemoModal}) => (
  <button className="handy-action handy-action-button focus-on-light" onClick={() => setShowDemoModal(true)} type="button">
    <img alt={demoViewIcon.alt} src={demoViewIcon.src} />
    <span>Explore a demo teacher account</span>
  </button>
)

const HandyActions = ({ linkedToClever, setShowDemoModal}) => {
  const [errors, setErrors] = React.useState<string[]>([])
  const [hasAppSetting, setHasAppSetting] = React.useState<boolean>(false);
  React.useEffect(() => {
    handleHasAppSetting({appSettingSetter: setHasAppSetting, errorSetter: setErrors, key: 'demo', })
  }, []);

  return(
    <section className="handy-actions">
      <h2>Handy actions</h2>
      <HandyAction icon={searchMapIcon} link="/assign/activity-library" text="Explore activity library" />
      <HandyAction icon={clipboardCheckIcon} link="/assign/diagnostic" text="Assign a diagnostic" />
      <HandyAction icon={tableCheckIcon} link="/teachers/classrooms/scorebook" text="View activity summary report" />
      <HandyAction icon={accountViewIcon} link="/teachers/classrooms?modal=view-as-student" text="View as a student" />
      {hasAppSetting && <ExploreDemoAction setShowDemoModal={setShowDemoModal} />}
      <HandyAction icon={giftIcon} link="/referrals" text="Refer a teacher" />
      <HandyAction icon={groupAccountIcon} link="/teachers/classrooms/new" text="Add a class" />
      {!linkedToClever && <HandyAction icon={googleClassroomIcon} link="/teachers/classrooms?modal=google-classroom" text="Import classes from Google" />}
    </section>
  )
}

export default HandyActions
