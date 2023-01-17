import React from 'react';

const ACTIVE = 'active'

const MyActivitiesTabs = () => {
  let openActivityPacksClassName, closedActivityPacksClassName, lessonsClassName

  if (window.location.pathname.includes('/lessons')) {
    lessonsClassName = ACTIVE
  } else if (window.location.pathname.includes('/closed')) {
    closedActivityPacksClassName = ACTIVE
  } else {
    openActivityPacksClassName = ACTIVE
  }

  return (
    <div className="unit-tabs tab-subnavigation-wrapper">
      <div className="container">
        <ul>
          <li><a className={openActivityPacksClassName} href="/teachers/classrooms/activity_planner">My Open Activity Packs</a></li>
          <li><a className={closedActivityPacksClassName} href="/teachers/classrooms/activity_planner/closed">My Closed Activity Packs</a></li>
          <li><a className={lessonsClassName} href="/teachers/classrooms/activity_planner/lessons">Launch Lessons</a></li>
        </ul>
      </div>
    </div>
  )
}

export default MyActivitiesTabs
