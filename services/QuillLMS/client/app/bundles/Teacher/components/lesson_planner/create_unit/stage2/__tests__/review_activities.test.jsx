import React from 'react'
import { shallow } from 'enzyme'

import ReviewActivities from '../create_a_class_inline_form.jsx'
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
