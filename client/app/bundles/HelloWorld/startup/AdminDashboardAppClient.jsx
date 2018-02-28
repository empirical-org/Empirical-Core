import React from 'react';
import AdminDashboardRouter from 'bundles/admin_dashboard/containers/AdminDashboardRouter';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import districtActivityScores from 'reducers/district_activity_scores';
import districtConceptReports from 'reducers/district_concept_reports';
import { Provider } from 'react-redux';

// TODO: start here tm: combined reducer is causing problems -- probably a
// namespace issue
//const reducer = combineReducers({districtActivityScores, districtConceptReports})
//const store = createStore(reducer, applyMiddleware(thunk));

const store = createStore(districtActivityScores, applyMiddleware(thunk));
const AdminDashboardApp = (props) => {
  return(
    <Provider store={store}>
      <AdminDashboardRouter {...props} />
    </Provider>
  );
};

export default AdminDashboardApp;
