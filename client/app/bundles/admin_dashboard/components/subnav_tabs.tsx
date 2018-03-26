import * as React from 'react';
import { Link } from 'react-router';

const SubnavTabs = () => {
  return(
    <div className="tab-subnavigation-wrapper class-subnav">
      <div className="container">
        <ul>
          <li>
            <Link to="/teachers/admin_dashboard">
              Admin Dashboard
            </Link>
          </li>
          <li>
            <Link to="/teachers/admin_dashboard/district_activity_scores">
              Activity Scores
            </Link>
          </li>
          <li>
            <Link to="/teachers/admin_dashboard/district_concept_reports">
              Concept Reports
            </Link>
          </li>
          <li>
            <Link to="/teachers/admin_dashboard/district_standards_reports">
             Standards Reports
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SubnavTabs;
