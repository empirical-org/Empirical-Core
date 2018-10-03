import React from 'react';
//import SelectSchoolType from '../components/accounts/new/select_school_type.jsx';
import EducatorType from '../components/accounts/new/educator_type.jsx';
import AnalyticsWrapper from '../components/shared/analytics_wrapper.js'

export default (props) => (
  <EducatorType analytics={new AnalyticsWrapper()}/>
);
