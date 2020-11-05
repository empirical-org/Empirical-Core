import * as React from 'react'
import { mount } from 'enzyme';

import { activities } from './data'

import TopicFilters from '../topic_filters'

function filterActivities(ignoredKey=null) { return activities }

describe('TopicFilters component', () => {

  it('should render when there are no content partner filters', () => {
    const wrapper = mount(<TopicFilters
      activities={activities}
      filterActivities={filterActivities}
      handleTopicFilterChange={() => {}}
      topicFilters={[]}
    />)
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when there are some content partner filters', () => {
    const wrapper = mount(<TopicFilters
      activities={activities}
      filterActivities={filterActivities}
      handleTopicFilterChange={() => {}}
      topicFilters={[1, 2, 3]}
    />)
    expect(wrapper).toMatchSnapshot();
  });

})
