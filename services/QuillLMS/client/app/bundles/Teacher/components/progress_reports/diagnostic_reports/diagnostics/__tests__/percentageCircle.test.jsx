import { mount } from 'enzyme'
import React from 'react'

import PercentageCircle from '../percentageCircle'

describe('PercentageCircle component', () => {
  it('should render', () => {
    const wrapper = mount(<PercentageCircle
      bgcolor="#ebebeb"
      borderWidth={8}
      color="#4ea500"
      innerColor="#ffffff"
      percent={55}
      radius={52}
    />)
    expect(wrapper).toMatchSnapshot()
  })

})
