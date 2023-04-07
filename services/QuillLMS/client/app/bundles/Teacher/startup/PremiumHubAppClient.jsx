import React from 'react';
import PremiumHubRouter from 'bundles/PremiumHub/containers/PremiumHubRouter';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import premiumHubReducer from 'reducers/premium_hub';
import districtActivityScores from 'reducers/district_activity_scores';
import districtConceptReports from 'reducers/district_concept_reports';
import districtStandardsReports from 'reducers/district_standards_reports';
import { Provider } from 'react-redux';


const bigApp = combineReducers({
  district_activity_scores: districtActivityScores,
  district_concept_reports: districtConceptReports,
  district_standards_reports: districtStandardsReports
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(bigApp, /* preloadedState, */ composeEnhancers(applyMiddleware(thunk)));

const PremiumHubApp = (props) => {
  return(
    <Provider store={store}>
      <PremiumHubRouter {...props} />
    </Provider>
  );
};

export default PremiumHubApp;
