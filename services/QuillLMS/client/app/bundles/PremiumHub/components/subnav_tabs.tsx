import * as React from 'react';
import { Link } from 'react-router-dom';
import { whiteDiamondIcon, redDiamondIcon, MAX_VIEW_WIDTH_FOR_MOBILE_NAVBAR } from '../../Shared';

const OVERVIEW = 'Overview';
const SCHOOL_SUBSCRIPTIONS = 'School Subscriptions';
const ACTIVITY_SCORES = 'Activity Scores';
const CONCEPT_REPORTS = 'Concept Reports';
const STANDARDS_REPORTS = 'Standards Reports';

export default class AdminSubnav extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = this.getStateFromProps(props)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps))
  }

  getStateFromProps(props) {
    const state = {activityScores: '', conceptReports: '', standardsReports: '', overview: '', schoolSubscriptions: '', activeTab: ''}
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
    const { overview, schoolSubscriptions, activityScores, conceptReports, standardsReports, dropdownOpen, activeTab } = this.state
    const onMobile = window.innerWidth <= MAX_VIEW_WIDTH_FOR_MOBILE_NAVBAR;
    const dropdownClass = dropdownOpen ? 'open' : '';

    if(onMobile) {
      return(
        <div className="tab-subnavigation-wrapper class-subnav premium-hub-subnav mobile red">
          <div className="dropdown-container">
            <div className={dropdownClass}>
              <button className="interactive-wrapper" id="mobile-subnav-dropdown" onClick={this.handleDropdownClick} type='button'>
                <p>{activeTab}</p>
                <i className="fa fa-thin fa-angle-down" />
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link className={overview} onClick={this.handleLinkClick} to="/teachers/premium_hub">
                    Overview
                  </Link>
                  <div className={`checkmark-icon ${overview}`} />
                </li>
                <li>
                  <Link className={schoolSubscriptions} onClick={this.handleLinkClick} to="/teachers/premium_hub/school_subscriptions">
                    School Subscriptions
                  </Link>
                  <div className={`checkmark-icon ${schoolSubscriptions}`} />
                </li>
                <li>
                  <Link className={`premium ${activityScores}`} onClick={this.handleLinkClick} to="/teachers/premium_hub/district_activity_scores">
                    Activity Scores{this.getIcon(activityScores)}
                  </Link>
                  <div className={`checkmark-icon ${activityScores}`} />
                </li>
                <li>
                  <Link className={`premium ${conceptReports}`} onClick={this.handleLinkClick} to="/teachers/premium_hub/district_concept_reports">
                    Concept Reports{this.getIcon(conceptReports)}
                  </Link>
                  <div className={`checkmark-icon ${conceptReports}`} />
                </li>
                <li>
                  <Link className={`premium ${standardsReports}`} onClick={this.handleLinkClick} to="/teachers/premium_hub/district_standards_reports">
                    Standards Reports{this.getIcon(standardsReports)}
                  </Link>
                  <div className={`checkmark-icon ${standardsReports}`} />
                </li>
              </ul>
            </div>
          </div>
        </div >
      )
    }

    return(
      <div className="tab-subnavigation-wrapper class-subnav premium-hub-subnav desktop">
        <div className="container">
          <ul>
            <li>
              <Link className={overview} to="/teachers/premium_hub">
              Overview
              </Link>
            </li>
            <li>
              <Link className={schoolSubscriptions} to="/teachers/premium_hub/school_subscriptions">
              School Subscriptions
              </Link>
            </li>
            <li>
              <Link className={`premium ${activityScores}`} to="/teachers/premium_hub/district_activity_scores">
                Activity Scores{this.getIcon(activityScores)}
              </Link>
            </li>
            <li>
              <Link className={`premium ${conceptReports}`} to="/teachers/premium_hub/district_concept_reports">
                Concept Reports{this.getIcon(conceptReports)}
              </Link>
            </li>
            <li>
              <Link className={`premium ${standardsReports}`} to="/teachers/premium_hub/district_standards_reports">
                Standards Reports{this.getIcon(standardsReports)}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
};
