import { mount } from 'enzyme'
import React from 'react'

import StudentNameOrTooltip from '../studentNameOrTooltip'

describe('StudentNameOrTooltip component', () => {
  it('should render if the name is long enough to warrant a tooltip', () => {
    const wrapper = mount(<StudentNameOrTooltip
      name="Gabriel De La Concordia Garcia Gabriel De La Concordia Garcia Gabriel De La Concordia Garcia"
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render if the name is not long enough to warrant a tooltip', () => {
    const wrapper = mount(<StudentNameOrTooltip
      name="Short Name"
    />)
    expect(wrapper).toMatchSnapshot()
  })

})
