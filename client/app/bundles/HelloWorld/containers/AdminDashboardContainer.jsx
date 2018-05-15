import React from 'react'
import SubnavTabs from '../components/admin_dashboard/subnav_tabs';

const AdminDashboardContainer = (props) => {
  return (
    <div className="tab-content">
      <div className="tab-pane active" id="class-manager">
        <SubnavTabs />
        <div id="admin-dashboard" data-id={props.id}>
          {props.children}
        </div>
      </div>
    </div>
  );
 };

export default AdminDashboardContainer;
