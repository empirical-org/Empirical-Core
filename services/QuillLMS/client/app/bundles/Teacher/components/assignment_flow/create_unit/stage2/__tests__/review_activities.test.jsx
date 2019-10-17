import React from 'react'
import { shallow } from 'enzyme'

import ReviewActivities from '../review_activities.jsx'
import { activities, dueDates } from './test_data/test_data'

describe('ReviewActivities component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <ReviewActivities
        activities={activities}
        assignActivityDueDate={() => {}}
        dueDates={dueDates}
        toggleActivitySelection={() => {}}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
