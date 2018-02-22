import React from 'react';
import AdminDashboardRouter from 'bundles/admin_dashboard/containers/AdminDashboardRouter';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import districtActivityScores from 'reducers/district_activity_scores';
import { Provider } from 'react-redux';

const store = createStore(districtActivityScores, applyMiddleware(thunk));

const AdminDashboardApp = (props) => {
  return(
    <Provider store={store}>
      <AdminDashboardRouter {...props} />
    </Provider>
  );
};

export default AdminDashboardApp;
