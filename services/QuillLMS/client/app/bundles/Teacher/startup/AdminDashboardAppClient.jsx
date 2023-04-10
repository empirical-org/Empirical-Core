import AdminDashboardRouter from 'bundles/admin_dashboard/containers/AdminDashboardRouter';
import React from 'react';
import { Provider } from 'react-redux';
import districtActivityScores from 'reducers/district_activity_scores';
import districtConceptReports from 'reducers/district_concept_reports';
import districtStandardsReports from 'reducers/district_standards_reports';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';


const bigApp = combineReducers({
  district_activity_scores: districtActivityScores,
  district_concept_reports: districtConceptReports,
  district_standards_reports: districtStandardsReports
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(bigApp, /* preloadedState, */ composeEnhancers(applyMiddleware(thunk)));

const AdminDashboardApp = (props) => {
  return(
    <Provider store={store}>
      <AdminDashboardRouter {...props} />
    </Provider>
  );
};

export default AdminDashboardApp;
