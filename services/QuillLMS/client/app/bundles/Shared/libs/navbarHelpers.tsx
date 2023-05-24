import * as React from 'react';
import { Link } from 'react-router-dom';
import { MAX_VIEW_WIDTH_FOR_MOBILE_NAVBAR } from '../utils/constants';

interface renderNavListProps {
  tabs: {
    [key: string]: {
      label: string,
      url: string
    }
  },
  activeStates: string[],
  handleLinkClick: () => void,
  listClass?: string
}

function renderListItem({ tabs, activeStates, handleLinkClick, tabLabel, i }) {
  const onMobile = window.innerWidth <= MAX_VIEW_WIDTH_FOR_MOBILE_NAVBAR;

  if (onMobile) {
    return(
      <li>
        <Link className={activeStates[i]} onClick={handleLinkClick} to={tabs[tabLabel].url}>
          {tabLabel}
        </Link>
        <div className={`checkmark-icon ${activeStates[i]}`} />
      </li>
    )
  }
  return (
    <li>
      <Link className={activeStates[i]} onClick={handleLinkClick} to={tabs[tabLabel].url}>
        {tabLabel}
      </Link>
    </li>
  )
}

export function renderNavList({tabs, activeStates, handleLinkClick, listClass}: renderNavListProps) {
  return(
    <ul className={listClass}>
      {Object.keys(tabs).map((tabLabel, i) => {
        return renderListItem({ tabs, activeStates, handleLinkClick, tabLabel, i })
      })}
    </ul>
  )
}
