import React from 'react';
import SelectSchoolType from '../components/accounts/new/select_school_type.jsx';
import AnalyticsWrapper from '../components/shared/analytics_wrapper.js'

export default (props) => (
  <SelectSchoolType analytics={new AnalyticsWrapper()}/>
);
