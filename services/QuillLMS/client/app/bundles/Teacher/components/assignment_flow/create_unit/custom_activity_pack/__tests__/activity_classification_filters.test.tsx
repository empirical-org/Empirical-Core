import { mount } from 'enzyme';
import * as React from 'react';

import ActivityClassificationFilters from '../activity_classification_filters';
import { activities } from './data';

function filterActivities(ignoredKey=null) { return activities }

const savedActivityIds = activities.slice(0, 2).map(a => a.id)

describe('ActivityClassificationFilters component', () => {

  it('should render when there are no activity classification filters or saved activity filters', () => {
    const wrapper = mount(<ActivityClassificationFilters
      activities={activities}
      activityClassificationFilters={[]}
      filterActivities={filterActivities}
      handleActivityClassificationFilterChange={() => {}}
      handleSavedActivityFilterChange={() => {}}
      savedActivityFilters={[]}
      savedActivityIds={[]}
    />)
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when there are some activity classification filters', () => {
    const wrapper = mount(<ActivityClassificationFilters
      activities={activities}
      activityClassificationFilters={['diagnostic', 'connect']}
      filterActivities={filterActivities}
      handleActivityClassificationFilterChange={() => {}}
      handleSavedActivityFilterChange={() => {}}
      savedActivityFilters={[]}
      savedActivityIds={savedActivityIds}
    />)
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when there are some saved activity filters', () => {
    const wrapper = mount(<ActivityClassificationFilters
      activities={activities}
      activityClassificationFilters={[]}
      filterActivities={filterActivities}
      handleActivityClassificationFilterChange={() => {}}
      handleSavedActivityFilterChange={() => {}}
      savedActivityFilters={savedActivityIds}
      savedActivityIds={savedActivityIds}
    />)
    expect(wrapper).toMatchSnapshot();
  });

})
