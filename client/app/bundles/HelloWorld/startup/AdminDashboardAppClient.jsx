import React from 'react';
import AdminDashboardRouter from 'bundles/admin_dashboard/containers/AdminDashboardRouter';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import adminDashboardReducer from 'reducers/admin_dashboard';
import district_activity_scores from 'reducers/district_activity_scores';
import district_concept_reports from 'reducers/district_concept_reports';
import { Provider } from 'react-redux';


const bigApp = combineReducers({
  district_activity_scores: district_activity_scores,
  district_concept_reports: district_concept_reports
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
