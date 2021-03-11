import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import AdminDashboardContainer from './AdminDashboardContainer';

export default function AdminDashboardRouter(props) {
  return (
    <BrowserRouter>
    <Route path="/teachers/admin_dashboard"
          render={passedProps => (
            <AdminDashboardContainer {...props} {...passedProps}/>
          )}
        />
    </BrowserRouter>
  )
}
