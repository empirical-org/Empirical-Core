import * as React from 'react';
import { Link } from 'react-router-dom';
import { MAX_VIEW_WIDTH_FOR_MOBILE_NAVBAR } from '../utils/constants';

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
  activeTab: string,
  handleLinkClick: () => void,
  listClass?: string
}

function getIcon(tabLabel: string) {
  const isReportingTab = premiumHubReportingTabs.includes(tabLabel)

  if (isReportingTab) {
    return <div className="small-diamond-icon" />
  }
}

function renderListItem({ tabs, handleLinkClick, tabLabel, activeTab, i }) {
  const onMobile = window.innerWidth <= MAX_VIEW_WIDTH_FOR_MOBILE_NAVBAR;
  const premiumClass = premiumHubReportingTabs.includes(tabLabel) ? 'premium' : ''
  const activeClass = activeTab === tabLabel ? 'active' : ''
  const linkClass = `${activeClass} ${premiumClass}`

  if (onMobile) {
    return (
      <li key={i}>
        <Link className={`${linkClass}`} onClick={handleLinkClick} to={tabs[tabLabel].url}>
          {tabLabel}
        </Link>
        <div className={`checkmark-icon ${activeClass}`} />
      </li>
    )
  }
  return (
    <li key={i}>
      <Link className={linkClass} onClick={handleLinkClick} to={tabs[tabLabel].url}>
        {tabLabel}
        {getIcon(tabLabel)}
      </Link>
    </li>
  )
}

export function renderNavList({ tabs, handleLinkClick, listClass, activeTab }: renderNavListProps) {
  return (
    <ul className={listClass}>
      {Object.keys(tabs).map((tabLabel, i) => {
        return renderListItem({ tabs, handleLinkClick, tabLabel, activeTab, i })
      })}
    </ul>
  )
}
