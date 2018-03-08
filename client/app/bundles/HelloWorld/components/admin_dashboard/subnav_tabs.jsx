import React from 'react';

const SubnavTabs = () => {
  return(
    <div className="tab-subnavigation-wrapper class-subnav">
      <div className="container">
        <ul>
          <li>
            <a href="/teachers/admin_dashboard">Admin Dashboard</a>
          </li>
          <li>
            <a href="/teachers/admin_dashboard/district_activity_scores">District Activity Scores</a>
          </li>
          <li>
            <a href="/teachers/admin_dashboard/district_concept_reports">District Concept Reports</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SubnavTabs;
