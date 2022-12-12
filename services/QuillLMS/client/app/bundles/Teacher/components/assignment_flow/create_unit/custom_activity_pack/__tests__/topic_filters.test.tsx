import * as React from 'react'
import { mount } from 'enzyme';

import { activities, topics } from './data'

import TopicFilters from '../topic_filters'

function filterActivities(ignoredKey=null) { return activities }

describe('TopicFilters component', () => {

  it('should render when there are no content partner filters', () => {
    const wrapper = mount(<TopicFilters
      activities={activities}
      filterActivities={filterActivities}
      handleTopicFilterChange={() => {}}
      topicFilters={[]}
      topics={topics}
    />)
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when there are some content partner filters', () => {
    const wrapper = mount(<TopicFilters
      activities={activities}
      filterActivities={filterActivities}
      handleTopicFilterChange={() => {}}
      topicFilters={[1, 2, 3]}
      topics={topics}
    />)
    expect(wrapper).toMatchSnapshot();
  });

})
