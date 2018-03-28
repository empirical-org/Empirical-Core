import React from 'react';
import SubnavTabs from '../components/subnav_tabs.tsx';

const AdminDashboardContainer = (props) => (
    <div className="tab-content">
      <div className="tab-pane active" id="class-manager">
        <SubnavTabs />
        <div id="admin-dashboard">
          {props.children}
        </div>
      </div>
    </div>
  );

export default AdminDashboardContainer;
