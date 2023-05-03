import React from 'react';
import useWindowSize from '../../../Shared/hooks/useWindowSize';
import { MAX_VIEW_WIDTH_FOR_MOBILE_NAVBAR, renderNavList } from '../../../Shared';

const ACTIVE = 'active'
const LAUNCH_LESSONS = 'Launch Lessons'
const MY_OPEN_ACTIVITY_PACKS = 'My Open Activity Packs'
const MY_CLOSED_ACTIVITY_PACKS = 'My Closed Activity Packs'
const tabs = {
  [MY_OPEN_ACTIVITY_PACKS]: {
    label: MY_OPEN_ACTIVITY_PACKS,
    url: '/teachers/classrooms/activity_planner'
  },
  [MY_CLOSED_ACTIVITY_PACKS]: {
    label: MY_CLOSED_ACTIVITY_PACKS,
    url: '/teachers/classrooms/activity_planner/closed'
  },
  [LAUNCH_LESSONS]: {
    label: LAUNCH_LESSONS,
    url: '/teachers/classrooms/activity_planner/lessons'
  }
}

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
  const activeStates = [openActivityPacksClassName, closedActivityPacksClassName, lessonsClassName];

  if(onMobile) {
    return(
      <div className="unit-tabs tab-subnavigation-wrapper mobile">
        <div className="dropdown-container">
          <div className={`${dropdownOpen ? 'open' : ''}`}>
            <button className="interactive-wrapper" onClick={handleDropdownClick} id="mobile-subnav-dropdown" type='button'>
              <p>{activeTab}</p>
              <i className="fa fa-thin fa-angle-down" />
            </button>
            {renderNavList({ tabs, activeStates, handleLinkClick: handleDropdownClick, listClass: 'dropdown-menu' })}
          </div>
        </div >
      </div >
    )
  }

  return (
    <div className='unit-tabs tab-subnavigation-wrapper desktop'>
      <div className="container">
        {renderNavList({ tabs, activeStates, handleLinkClick: handleDropdownClick })}
      </div>
    </div>
  )
}

export default MyActivitiesTabs
