import React from 'react'
import { shallow } from 'enzyme'

import ReviewActivities from '../review_activities.jsx'
import { activities, dueDates } from './test_data/test_data'

describe('ReviewActivities component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <ReviewActivities
        toggleActivitySelection={() => {}}
        activities={activities}
        dueDates={dueDates}
        assignActivityDueDate={() => {}}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
