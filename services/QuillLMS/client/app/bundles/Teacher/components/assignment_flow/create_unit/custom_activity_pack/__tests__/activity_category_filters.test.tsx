import { mount } from 'enzyme';
import * as React from 'react';

import ActivityCategoryFilters from '../activity_category_filters';
import { activities } from './data';

function filterActivities(ignoredKey=null) { return activities }

describe('ActivityCategoryFilters component', () => {

  it('should render when there are no activity category filters', () => {
    const wrapper = mount(<ActivityCategoryFilters
      activities={activities}
      activityCategoryFilters={[]}
      filterActivities={filterActivities}
      handleActivityCategoryFilterChange={() => {}}
    />)
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when there are some activity category filters', () => {
    const wrapper = mount(<ActivityCategoryFilters
      activities={activities}
      activityCategoryFilters={[1, 2, 3]}
      filterActivities={filterActivities}
      handleActivityCategoryFilterChange={() => {}}
    />)
    expect(wrapper).toMatchSnapshot();
  });

})
