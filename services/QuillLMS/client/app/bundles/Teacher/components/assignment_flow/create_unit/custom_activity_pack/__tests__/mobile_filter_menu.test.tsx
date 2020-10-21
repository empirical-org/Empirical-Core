import * as React from 'react'
import { mount } from 'enzyme';

import { activities } from './data'

import MobileFilterMenu from '../mobile_filter_menu'

describe('MobileFilterMenu component', () => {
  const props = {
    activities: activities,
    filteredActivities: activities,
    calculateNumberOfFilters: () => 0,
    resetAllFilters: () => {},
    activityClassificationFilters: [],
    handleActivityClassificationFilterChange: () => {},
    gradeLevelFilters: [],
    handleGradeLevelFilterChange: () => {},
    activityCategoryFilters: [],
    handleActivityCategoryFilterChange: () => {},
    filterActivities: (ignoredKey?: string) => activities,
    setShowMobileFilterMenu: (show: boolean) => {},
    showMobileFilterMenu: false
  }

  describe('with showMobileFilterMenu false', () => {
    it('should render', () => {
      const wrapper = mount(<MobileFilterMenu {...props} />)
      expect(wrapper).toMatchSnapshot();
    });
  })

  describe('with showMobileFilterMenu true', () => {
    it('should render', () => {
      const wrapper = mount(<MobileFilterMenu {...props} showMobileFilterMenu={true} />)
      expect(wrapper).toMatchSnapshot();
    });
  })

})
