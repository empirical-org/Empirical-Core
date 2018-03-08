import React from 'react'
import SubnavTabs from 'bundles/admin_dashboard/components/subnav_tabs';

const AdminDashboardContainer = (props) => {
  return (
    <div className="tab-content">
      <div className="tab-pane active" id="class-manager">
        <SubnavTabs />
        <div id="admin-dashboard">
          {props.children}
        </div>
      </div>
    </div>
  );
 };

export default AdminDashboardContainer;
