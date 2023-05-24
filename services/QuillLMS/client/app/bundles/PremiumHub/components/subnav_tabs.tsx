import * as React from 'react';
import { whiteDiamondIcon, redDiamondIcon, renderNavList } from '../../Shared';

const OVERVIEW = 'Overview';
const SCHOOL_SUBSCRIPTIONS = 'School Subscriptions';
const ACTIVITY_SCORES = 'Activity Scores';
const CONCEPT_REPORTS = 'Concept Reports';
const STANDARDS_REPORTS = 'Standards Reports';
const USAGE_SNAPSHOT_REPORT = 'Usage Snapshot Report'
const tabs = {
  [OVERVIEW]: {
    label: OVERVIEW,
    url: '/teachers/premium_hub'
  },
  [SCHOOL_SUBSCRIPTIONS]: {
    label: SCHOOL_SUBSCRIPTIONS,
    url: '/teachers/premium_hub/school_subscriptions'
  },
  [USAGE_SNAPSHOT_REPORT]: {
    label: USAGE_SNAPSHOT_REPORT,
    url: '/teachers/premium_hub/usage_snapshot_report'
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
  [STANDARDS_REPORTS]: {
    label: STANDARDS_REPORTS,
    url: '/teachers/premium_hub/district_standards_reports'
  },
}

export default class AdminSubnav extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = this.getStateFromProps(props)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps))
  }

  getStateFromProps(props) {
    const state = {activityScores: '', conceptReports: '', standardsReports: '', overview: '', schoolSubscriptions: '', activeTab: '', usageSnapshotReport: ''}
    if (props.path.pathname.includes('/district_activity_scores')) {
      state.activityScores = 'active'
      state.activeTab = ACTIVITY_SCORES
    } else if (props.path.pathname.includes('/district_concept_reports')) {
      state.conceptReports = 'active'
      state.activeTab = CONCEPT_REPORTS
    } else if (props.path.pathname.includes('/district_standards_reports')) {
      state.standardsReports = 'active'
      state.activeTab = STANDARDS_REPORTS
    } else if (props.path.pathname.includes('school_subscriptions')) {
      state.schoolSubscriptions = 'active'
      state.activeTab = SCHOOL_SUBSCRIPTIONS
    } else if (props.path.pathname.includes('usage_snapshot_report')) {
      state.usageSnapshotReport = 'active'
      state.activeTab = USAGE_SNAPSHOT_REPORT
    } else if (props.path.pathname.includes('premium_hub')) {
      state.overview = 'active'
      state.activeTab = OVERVIEW
    }
    return state
  }

  getIcon(activeTab) {
    if(activeTab) {
      return <img alt={redDiamondIcon.alt} src={redDiamondIcon.src} />
    }
    return <img alt={whiteDiamondIcon.alt} src={whiteDiamondIcon.src} />
  }

  handleDropdownClick = () => {
    const { dropdownOpen } = this.state;
    this.setState({ dropdownOpen: !dropdownOpen });
  }

  handleLinkClick = () => {
    this.setState({ dropdownOpen: false });
  }

  render() {
    const { overview, schoolSubscriptions, activityScores, conceptReports, standardsReports, dropdownOpen, usageSnapshotReport, activeTab } = this.state
    const activeStates = [overview, schoolSubscriptions, usageSnapshotReport, activityScores, conceptReports, standardsReports]
    const dropdownClass = dropdownOpen ? 'open' : '';

    return(
      <React.Fragment>
        <div className="tab-subnavigation-wrapper mobile class-subnav premium-hub-subnav red">
          <div className="dropdown-container">
            <div className={dropdownClass}>
              <button className="interactive-wrapper" id="mobile-subnav-dropdown" onClick={this.handleDropdownClick} type='button'>
                <p>{activeTab}</p>
                <i className="fa fa-thin fa-angle-down" />
              </button>
              {renderNavList({ tabs, activeStates, handleLinkClick: this.handleLinkClick, listClass: 'dropdown-menu' })}
            </div>
          </div>
        </div >
        <div className="tab-subnavigation-wrapper desktop class-subnav premium-hub-subnav">
          <div className="container">
            {renderNavList({ tabs, activeStates, handleLinkClick: this.handleLinkClick })}
          </div>
        </div>
      </React.Fragment>
    );
  }
};
