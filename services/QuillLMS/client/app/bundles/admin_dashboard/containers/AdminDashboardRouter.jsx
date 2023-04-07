import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import AdminDashboardContainer from './AdminDashboardContainer';

export default function AdminDashboardRouter(props) {
  return (
    <BrowserRouter>
      <Route
        path="/teachers/premium_hub"
        render={passedProps => (
          <AdminDashboardContainer {...props} {...passedProps} />
        )}
      />
    </BrowserRouter>
  )
}
