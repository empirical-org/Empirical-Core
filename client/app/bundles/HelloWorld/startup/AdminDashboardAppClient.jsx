import React from 'react';
import AdminDashboardRouter from '../containers/AdminDashboardRouter';
import SubnavTabs from '../components/admin_dashboard/subnav_tabs';

const AdminDashboardApp = (props) => {
  return(<AdminDashboardRouter {...props} />);
};

export default AdminDashboardApp;
