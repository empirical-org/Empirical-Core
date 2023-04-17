import * as React from 'react';
import { Link } from 'react-router-dom';
import { whiteDiamondIcon, redDiamondIcon } from '../../Shared';

export default class AdminSubnav extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = this.getStateFromProps(props)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps))
  }

  getStateFromProps(props) {
    const state = {activityScores: '', conceptReports: '', standardsReports: '', overview: '', schoolSubscriptions: ''}
    if (props.path.pathname.includes('/district_activity_scores')) {
      state.activityScores = 'active'
    } else if (props.path.pathname.includes('/district_concept_reports')) {
      state.conceptReports = 'active'
    } else if (props.path.pathname.includes('/district_standards_reports')) {
      state.standardsReports = 'active'
    } else if (props.path.pathname.includes('school_subscriptions')) {
      state.schoolSubscriptions = 'active'
    } else if (props.path.pathname.includes('premium_hub')) {
      state.overview = 'active'
    }
    return state
  }

  getIcon(activeTab) {
    if(activeTab) {
      return <img alt={redDiamondIcon.alt} src={redDiamondIcon.src} />
    }
    return <img alt={whiteDiamondIcon.alt} src={whiteDiamondIcon.src} />
  }

  render() {
    const { overview, schoolSubscriptions, activityScores, conceptReports, standardsReports, } = this.state

    return(
      <div className="tab-subnavigation-wrapper class-subnav premium-hub-subnav">
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
