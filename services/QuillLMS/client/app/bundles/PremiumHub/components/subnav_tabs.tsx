import * as React from 'react';
import { renderNavList } from '../../Shared';

const ACTIVITY_SCORES = 'Activity Scores';
const CONCEPT_REPORTS = 'Concept Reports';
const INTEGRATIONS = 'Integrations';
const OVERVIEW = 'Overview';
const SCHOOL_SUBSCRIPTIONS = 'School Subscriptions';
const STANDARDS_REPORTS = 'Standards Reports';
const USAGE_SNAPSHOT_REPORT = 'Usage Snapshot Report'
const DATA_EXPORT = 'Data Export'

const tabsWithoutUsageSnapshotAndDataExportReport = {
  [OVERVIEW]: {
    label: OVERVIEW,
    url: '/teachers/premium_hub'
  },
  [SCHOOL_SUBSCRIPTIONS]: {
    label: SCHOOL_SUBSCRIPTIONS,
    url: '/teachers/premium_hub/school_subscriptions'
  },
  [ACTIVITY_SCORES]: {
    label: ACTIVITY_SCORES,
    url: '/teachers/premium_hub/district_activity_scores'
  },
  [CONCEPT_REPORTS]: {
    label: CONCEPT_REPORTS,
    url: '/teachers/premium_hub/district_concept_reports'
  },
  [STANDARDS_REPORTS]: {
    label: STANDARDS_REPORTS,
    url: '/teachers/premium_hub/district_standards_reports'
  },
  [INTEGRATIONS]: {
    label: INTEGRATIONS,
    url: '/teachers/premium_hub/integrations'
  },
}

const tabs = {
  ...tabsWithoutUsageSnapshotAndDataExportReport,
  [DATA_EXPORT]: {
    label: DATA_EXPORT,
    url: '/teachers/premium_hub/data_export'
  },
  [USAGE_SNAPSHOT_REPORT]: {
    label: USAGE_SNAPSHOT_REPORT,
    url: '/teachers/premium_hub/usage_snapshot_report'
  },
}

export const AdminSubnav = ({ path }) => {

  const [activeTab, setActiveTab] = React.useState<string>('');
  const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (path.pathname) {
      determineActiveTab()
    }
  }, [path.pathname])

  function determineActiveTab() {
    const { pathname } = path;
    if (pathname.includes('/district_activity_scores')) {
      setActiveTab(ACTIVITY_SCORES)
    } else if (pathname.includes('/district_concept_reports')) {
      setActiveTab(CONCEPT_REPORTS)
    } else if (pathname.includes('/district_standards_reports')) {
      setActiveTab(STANDARDS_REPORTS)
    } else if (pathname.includes('/school_subscriptions')) {
      setActiveTab(SCHOOL_SUBSCRIPTIONS)
    } else if (pathname.includes('/usage_snapshot_report')) {
      setActiveTab(USAGE_SNAPSHOT_REPORT)
    } else if (pathname.includes('/data_export')) {
      setActiveTab(DATA_EXPORT)
    } else if (pathname.includes('/integrations')) {
      setActiveTab(INTEGRATIONS)
    } else if (pathname.includes('/premium_hub')) {
      setActiveTab(OVERVIEW)
    }
  }

  function handleDropdownClick() {
    setDropdownOpen(!dropdownOpen);
  }

  function handleLinkClick() {
    setDropdownOpen(false);
  }

  const dropdownClass = dropdownOpen ? 'open' : '';

  const tabsToShow = window.location.href.includes('usage_snapshot') || window.location.href.includes('data_export') ? tabs : tabsWithoutUsageSnapshotAndDataExportReport

  return(
    <React.Fragment>
      <div className="tab-subnavigation-wrapper mobile class-subnav premium-hub-subnav red">
        <div className="dropdown-container">
          <div className={dropdownClass}>
            <button className="interactive-wrapper" id="mobile-subnav-dropdown" onClick={handleDropdownClick} type='button'>
              <p>{activeTab}</p>
              <i className="fa fa-thin fa-angle-down" />
            </button>
            {renderNavList({ tabs: tabsToShow, handleLinkClick: handleLinkClick, activeTab, listClass: 'dropdown-menu' })}
          </div>
        </div>
      </div >
      <div className="tab-subnavigation-wrapper desktop class-subnav premium-hub-subnav">
        <div className="container">
          {renderNavList({ tabs: tabsToShow, handleLinkClick: handleLinkClick, activeTab })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminSubnav
