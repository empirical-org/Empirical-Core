import React from 'react'
import SubnavTabs from '../components/admin_dashboard/subnav_tabs';

const AdminDashboardContainer = (props) => {
  return (
    <div className="tab-content">
      <div className="tab-pane active" id="class-manager">
        <SubnavTabs />
        <div data-id={props.id} id="admin-dashboard">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContainer;
