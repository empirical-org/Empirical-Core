import { mount } from 'enzyme';
import * as React from 'react';

import { activities, topics } from './data';

import { EVIDENCE_BETA1, EVIDENCE_BETA2, PRODUCTION } from '../../../../../../../constants/flagOptions';
import FilterColumn from '../filter_column';

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
    gradeLevelFilters: [],
    handleGradeLevelFilterChange: () => {},
    ellFilters: [],
    handleELLFilterChange: () => {},
    flagFilters: [],
    handleFlagFilterChange: () => {},
    earlyAccessFilters: [],
    handleEarlyAccessFilterChange: () => {},
    readabilityGradeLevelFilters: [],
    handleReadabilityGradeLevelFilterChange: () => {},
    activityCategoryFilters: [],
    handleActivityCategoryFilterChange: () => {},
    contentPartnerFilters: [],
    handleContentPartnerFilterChange: () => {},
    topicFilters: [],
    handleTopicFilterChange: () => {},
    filterActivities: (ignoredKey?: string) => activities,
    handleSavedActivityFilterChange: () => {},
    savedActivityFilters: [],
    savedActivityIds: [],
    flagset: PRODUCTION,
    topics: topics,
  }

  it('should render', () => {
    const wrapper = mount(<FilterColumn {...props} />)
    expect(wrapper).toMatchSnapshot();
  });

  describe('if flagset is one of the evidence betas', () => {
    it('should render', () => {
      const wrapper = mount(<FilterColumn {...props} flagset={EVIDENCE_BETA1} />)
      expect(wrapper).toMatchSnapshot();
    })

    it('should render', () => {
      const wrapper = mount(<FilterColumn {...props} flagset={EVIDENCE_BETA2} />)
      expect(wrapper).toMatchSnapshot();
    })
  });


})
