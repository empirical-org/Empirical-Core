import * as React from 'react'
import { mount } from 'enzyme';

import { activities } from './data'
import ActivityClassificationFilters from '../activity_classification_filters'

function filterActivities(ignoredKey=null) { return activities }

describe('ActivityClassificationFilters component', () => {

  it('should render when there are no activity classification filters', () => {
    const wrapper = mount(<ActivityClassificationFilters
      activities={activities}
      filterActivities={filterActivities}
      activityClassificationFilters={[]}
      handleActivityClassificationFilterChange={() => {}}
    />)
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when there are some activity classification filters', () => {
    const wrapper = mount(<ActivityClassificationFilters
      activities={activities}
      filterActivities={filterActivities}
      activityClassificationFilters={['diagnostic', 'connect']}
      handleActivityClassificationFilterChange={() => {}}
    />)
    expect(wrapper).toMatchSnapshot();
  });

})
