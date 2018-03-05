import React from 'react';
import AdminDashboardRouter from 'bundles/admin_dashboard/containers/AdminDashboardRouter';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import adminDashboardReducer from 'reducers/admin_dashboard';
import district_activity_scores from 'reducers/district_activity_scores';
import district_concept_reports from 'reducers/district_concept_reports';
import { Provider } from 'react-redux';



const bigApp = combineReducers({
  district_activity_scores: district_activity_scores,
  district_concept_reports: district_concept_reports
});

// reducer composition pattern
//const bigReduce = (state = {}, action) => {
//  return {
//    district_activity_scores: district_activity_scores(
//      state.district_activity_scores,
//      action
//    ),
//    district_concept_reports: district_concept_reports(
//      state.district_concept_reports,
//      action
//    )
//  };
//};


// TODO: start here tm: combined reducer is causing problems -- probably a
// namespace issue

// single store w redux dev tools enabled
//
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//const store = createStore(district_activity_scores, /* preloadedState, */ composeEnhancers(applyMiddleware(thunk)));

// old working single store
//const store = createStore(district_activity_scores, applyMiddleware(thunk));

// combined store w dev tools
const store = createStore(bigApp, /* preloadedState, */ composeEnhancers(applyMiddleware(thunk)));

console.log('Initial state:');
console.log(store.getState());
console.log('--------------');

store.dispatch({ type: 'SWITCH_SCHOOL', school:'hogwarts', })

console.log('Current state:');
console.log(store.getState());
console.log('--------------');


const AdminDashboardApp = (props) => {
  return(
    <Provider store={store}>
      <AdminDashboardRouter {...props} />
    </Provider>
  );
};

export default AdminDashboardApp;
