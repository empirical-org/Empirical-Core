import React from 'react'
import { mount } from 'enzyme'

import OverrideWarningModal from '../overrideWarningModal'

describe('OverrideWarningModal component', () => {

  it('should render', () => {
    const wrapper = mount(
      <OverrideWarningModal
        activityName="Activity Name"
        handleClickAssign={() => {}}
        handleCloseModal={() => {}}
        studentNames={['Student Name']}
      />)
    expect(wrapper).toMatchSnapshot()
  })
})
