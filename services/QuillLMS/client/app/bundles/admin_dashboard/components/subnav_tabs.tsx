import * as React from 'react';
import { Link } from 'react-router-dom';

export default class AdminSubnav extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = this.getStateFromProps(props)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps))
  }

  getStateFromProps(props) {
    const state = {activityScores: '', conceptReports: '', standardsReports: '', overview: ''}
    if (props.path.pathname.includes('/district_activity_scores')) {
      state.activityScores = 'active'
    } else if (props.path.pathname.includes('/district_concept_reports')) {
      state.conceptReports = 'active'
    } else if (props.path.pathname.includes('/district_standards_reports')) {
      state.standardsReports = 'active'
    } else if (props.path.pathname.includes('admin_dashboard')) {
      state.overview = 'active'
    }
    return state
  }

  render() {
    return(
      <div className="tab-subnavigation-wrapper class-subnav">
        <div className="container">
          <ul>
            <li>
              <Link className={this.state.overview} to="/teachers/admin_dashboard">
              Overview
              </Link>
            </li>
            <li>
              <Link className={`premium ${this.state.activityScores}`} to="/teachers/admin_dashboard/district_activity_scores">
            Activity Scores <i className="fas fa-star" />
              </Link>
            </li>
            <li>
              <Link className={`premium ${this.state.conceptReports}`} to="/teachers/admin_dashboard/district_concept_reports">
          Concept Reports <i className="fas fa-star" />
              </Link>
            </li>
            <li>
              <Link className={`premium ${this.state.standardsReports}`} to="/teachers/admin_dashboard/district_standards_reports">
        Standards Reports <i className="fas fa-star" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
};
