import React from 'react';
import useWindowSize from '../../../Shared/hooks/useWindowSize';
import { MAX_VIEW_WIDTH_FOR_MOBILE_NAVBAR } from '../../../Shared';

const ACTIVE = 'active'
const LAUNCH_LESSONS = 'Launch Lessons'
const MY_OPEN_ACTIVITY_PACKS = 'My Open Activity Packs'
const MY_CLOSED_ACTIVITY_PACKS = 'My Closed Activity Packs'

const MyActivitiesTabs = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  let openActivityPacksClassName, closedActivityPacksClassName, lessonsClassName, activeTab

  if (window.location.pathname.includes('/lessons')) {
    lessonsClassName = ACTIVE
    activeTab = LAUNCH_LESSONS
  } else if (window.location.pathname.includes('/closed')) {
    closedActivityPacksClassName = ACTIVE
    activeTab = MY_CLOSED_ACTIVITY_PACKS
  } else {
    openActivityPacksClassName = ACTIVE
    activeTab = MY_OPEN_ACTIVITY_PACKS
  }

  function handleDropdownClick() {
    setDropdownOpen(!dropdownOpen)
  }

  const size = useWindowSize();
  const onMobile = size.width <= MAX_VIEW_WIDTH_FOR_MOBILE_NAVBAR;

  if(onMobile) {
    return(
      <div className="unit-tabs tab-subnavigation-wrapper mobile">
        <div className="dropdown-container">
          <div className={`${dropdownOpen ? 'open' : ''}`}>
            <button className="interactive-wrapper" onClick={handleDropdownClick} id="mobile-subnav-dropdown" type='button'>
              <p>{activeTab}</p>
              <i className="fa fa-thin fa-angle-down" />
            </button>
            <ul className="dropdown-menu" role='menu'>
              <li>
                <a className={openActivityPacksClassName} href="/teachers/classrooms/activity_planner">{MY_OPEN_ACTIVITY_PACKS}</a>
                <img className={openActivityPacksClassName} src="https://assets.quill.org/images/shared/check-small-white.svg"></img>
              </li>
              <li>
                <a className={closedActivityPacksClassName} href="/teachers/classrooms/activity_planner/closed">{MY_CLOSED_ACTIVITY_PACKS}</a>
                <img className={closedActivityPacksClassName} src="https://assets.quill.org/images/shared/check-small-white.svg"></img>
              </li>
              <li>
                <a className={lessonsClassName} href="/teachers/classrooms/activity_planner/lessons">{LAUNCH_LESSONS}</a>
                <img className={lessonsClassName} src="https://assets.quill.org/images/shared/check-small-white.svg"></img>
              </li>
            </ul>
          </div>
        </div >
      </div >
    )
  }

  return (
    <div className='unit-tabs tab-subnavigation-wrapper desktop'>
      <div className="container">
        <ul>
          <li><a className={openActivityPacksClassName} href="/teachers/classrooms/activity_planner">{MY_OPEN_ACTIVITY_PACKS}</a></li>
          <li><a className={closedActivityPacksClassName} href="/teachers/classrooms/activity_planner/closed">{MY_CLOSED_ACTIVITY_PACKS}</a></li>
          <li><a className={lessonsClassName} href="/teachers/classrooms/activity_planner/lessons">{LAUNCH_LESSONS}</a></li>
        </ul>
      </div>
    </div>
  )
}

export default MyActivitiesTabs
