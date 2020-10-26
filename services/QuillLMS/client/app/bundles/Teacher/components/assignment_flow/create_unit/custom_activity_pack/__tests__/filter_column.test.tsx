import * as React from 'react'
import { mount } from 'enzyme';

import { activities } from './data'

import FilterColumn from '../filter_column'

describe('FilterColumn component', () => {
  const props = {
    activities: activities,
    filteredActivities: activities,
    calculateNumberOfFilters: () => 0,
    resetAllFilters: () => {},
    activityClassificationFilters: [],
    handleActivityClassificationFilterChange: () => {},
    ccssGradeLevelFilters: [],
    handleCCSSGradeLevelFilterChange: () => {},
    activityCategoryFilters: [],
    handleActivityCategoryFilterChange: () => {},
    contentPartnerFilters: [],
    handleContentPartnerFilterChange: () => {},
    filterActivities: (ignoredKey?: string) => activities
  }

  it('should render', () => {
    const wrapper = mount(<FilterColumn {...props} />)
    expect(wrapper).toMatchSnapshot();
  });

})
