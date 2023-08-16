import * as React from 'react';
import { Link } from 'react-router-dom';
import { MAX_VIEW_WIDTH_FOR_MOBILE_NAVBAR } from '../utils/constants';
import { redDiamondIcon, whiteDiamondIcon } from '../images';

const premiumHubReportingTabs = [
  'Activity Scores',
  'Concept Reports',
  'Data Export',
  'Integrations',
  'Standards Reports',
  'Usage Snapshot Report'
];

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

function getIcon(activeTab: string, tabLabel: string) {
  const isReportingTab = premiumHubReportingTabs.includes(tabLabel)
  if (activeTab && isReportingTab) {
    return <img alt={redDiamondIcon.alt} src={redDiamondIcon.src} />
  } else if (isReportingTab) {
    return <img alt={whiteDiamondIcon.alt} src={whiteDiamondIcon.src} />
  }
}

function renderListItem({ tabs, activeStates, handleLinkClick, tabLabel, i }) {
  const onMobile = window.innerWidth <= MAX_VIEW_WIDTH_FOR_MOBILE_NAVBAR;

  if (onMobile) {
    return (
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
        {getIcon(activeStates[i], tabLabel)}
      </Link>
    </li>
  )
}

export function renderNavList({ tabs, activeStates, handleLinkClick, listClass }: renderNavListProps) {
  return (
    <ul className={listClass}>
      {Object.keys(tabs).map((tabLabel, i) => {
        return renderListItem({ tabs, activeStates, handleLinkClick, tabLabel, i })
      })}
    </ul>
  )
}
