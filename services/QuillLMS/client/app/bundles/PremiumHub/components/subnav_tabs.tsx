import * as React from 'react';
import { Link } from 'react-router-dom';

import { renderNavList } from '../../Shared';
import { MOUSEDOWN, KEYDOWN, } from '../../Shared/utils/eventNames'
import { ESCAPE, } from '../../Shared/utils/keyNames'

const ACTIVITY_SCORES = 'Activity Scores Report';
const CONCEPT_REPORTS = 'Concepts Report';
const INTEGRATIONS = 'Integrations';
const OVERVIEW = 'Overview';
const SUBSCRIPTIONS = 'Subscriptions';
const STANDARDS_REPORTS = 'Standards Report';
const USAGE_SNAPSHOT_REPORT = 'Usage Snapshot Report'
const DATA_EXPORT = 'Data Export'
const DIAGNOSTIC_GROWTH_REPORT = 'Diagnostic Growth Report'
const PREMIUM_REPORTS = 'Premium Reports'

const baseTabs = {
  [OVERVIEW]: {
    label: OVERVIEW,
    url: '/teachers/premium_hub'
  },
  [SUBSCRIPTIONS]: {
    label: SUBSCRIPTIONS,
    url: '/teachers/premium_hub/school_subscriptions'
  },
  [INTEGRATIONS]: {
    label: INTEGRATIONS,
    url: '/teachers/premium_hub/integrations'
  },
}

const mobileTabs = {
  ...baseTabs,
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
  [USAGE_SNAPSHOT_REPORT]: {
    label: USAGE_SNAPSHOT_REPORT,
    url: '/teachers/premium_hub/usage_snapshot_report'
  }
}

const premiumReportDropdownItems = [
  {
    label: USAGE_SNAPSHOT_REPORT,
    url: '/teachers/premium_hub/usage_snapshot_report',
    new: true
  },
  // TODO: uncomment the following two when the reports are ready for public access
  // {
  //   label: DIAGNOSTIC_GROWTH_REPORT,
  //   url: '/teachers/premium_hub/diagnostic_growth_report',
  //   new: true
  // },
  // {
  //   label: DATA_EXPORT,
  //   url: '/teachers/premium_hub/data_export',
  //   new: true
  // },
  {
    label: CONCEPT_REPORTS,
    url: '/teachers/premium_hub/district_concept_reports'
  },
  {
    label: ACTIVITY_SCORES,
    url: '/teachers/premium_hub/district_activity_scores'
  },
  {
    label: STANDARDS_REPORTS,
    url: '/teachers/premium_hub/district_standards_reports'
  },
]

const tabs = {
  ...baseTabs,
  [DIAGNOSTIC_GROWTH_REPORT]: {
    label: DIAGNOSTIC_GROWTH_REPORT,
    url: '/teachers/premium_hub/diagnostic_growth_report'
  },
  [DATA_EXPORT]: {
    label: DATA_EXPORT,
    url: '/teachers/premium_hub/data_export'
  }
}

const PremiumReportsDropdown = ({ activeTab }) => {
  const dropdownId = "premium-reports-nav-dropdown"
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null)
  const dropdownRef = React.useRef(null);
  const buttonRef = React.useRef(null);

  React.useEffect(() => {
    document.addEventListener(MOUSEDOWN, handleClickOutside);
    document.addEventListener(KEYDOWN, handleKeyDown);
    return () => {
      document.removeEventListener(MOUSEDOWN, handleClickOutside);
      document.removeEventListener(KEYDOWN, handleKeyDown);
    };
  }, [dropdownRef, isOpen]);

  const activeClass = activeTab === PREMIUM_REPORTS ? 'active' : '';
  const openClass = isOpen ? 'open' : '';

  function toggleDropdown() {
    if (isOpen) {
      closeDropdown()
    } else {
      setIsOpen(true);

      // setTimeout here is a workaround to make sure that the dropdownRef is actually available in the DOM by the time this executes (it pushes execution to the end of the event queue, after the rerender)
      setTimeout(() => {
        const firstItem = dropdownRef.current.querySelector('a');
        if (firstItem) firstItem.focus();
      }, 0);
    }
  }

  function closeDropdown() {
    if (!isOpen) { return }

    setIsOpen(false);
    // Return focus to the button when dropdown closes
    buttonRef.current.focus();
  }

  function handleClickOutside(event) {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      closeDropdown();
    }
  }

  function handleKeyDown(event) {
    if (event.key === ESCAPE) {
      closeDropdown();
    }
  }

  function renderDropdown() {
    return (
      <div className={dropdownId} id={dropdownId} ref={dropdownRef} role="menu">
        {premiumReportDropdownItems.map((item) => (
          <Link className="focus-on-light" key={item.label} onClick={closeDropdown} role="menuitem" to={item.url}>
            {item.label}
            {item.new ? <span className="new-tag">NEW</span> : null}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <li className="premium-reports-tab" ref={containerRef}>
      <button
        aria-controls={dropdownId}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`premium-reports-button focus-on-dark ${activeClass} ${openClass}`}
        onClick={toggleDropdown}
        ref={buttonRef}
        type="button"
      >
        <span>Premium Reports</span>
      </button>
      {isOpen ? renderDropdown() : null}
    </li>
  );
};

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

    const reportPaths = ['/district_activity_scores', '/district_concept_reports', '/district_standards_reports', '/usage_snapshot_report']

    if (reportPaths.find(path => pathname.includes(path))) {
      setActiveTab(PREMIUM_REPORTS)
    } else if (pathname.includes('/school_subscriptions')) {
      setActiveTab(SUBSCRIPTIONS)
    } else if (pathname.includes('/diagnostic_growth_report')) {
      setActiveTab(DIAGNOSTIC_GROWTH_REPORT)
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

  const tabsToShow = window.location.href.includes('data_export') || window.location.href.includes('diagnostic_growth_report') ? tabs : baseTabs

  return(
    <React.Fragment>
      <div className="tab-subnavigation-wrapper mobile class-subnav premium-hub-subnav red">
        <div className="dropdown-container">
          <div className={dropdownClass}>
            <button className="interactive-wrapper" id="mobile-subnav-dropdown" onClick={handleDropdownClick} type='button'>
              <p>{activeTab}</p>
              <i className="fa fa-thin fa-angle-down" />
            </button>
            {renderNavList({ tabs: mobileTabs, handleLinkClick: handleLinkClick, activeTab, listClass: 'dropdown-menu' })}
          </div>
        </div>
      </div >
      <div className="tab-subnavigation-wrapper desktop class-subnav premium-hub-subnav">
        <div className="container">
          {renderNavList({ tabs: tabsToShow, handleLinkClick: handleLinkClick, activeTab, childElement: <PremiumReportsDropdown activeTab={activeTab} /> })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminSubnav
