import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import AdminDashboardContainer from './AdminDashboardContainer';

const AdminDashboardRouter = props => (
  <BrowserRouter>
    <Route component={AdminDashboardContainer} path="/teachers/admin_dashboard" />
  </BrowserRouter>
  );

export default AdminDashboardRouter;
