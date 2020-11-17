import * as React from 'react';
import { mount } from 'enzyme';

import { TwoThumbSlider } from '../twoThumbSlider'

describe('TwoThumbSlider component', () => {
  it('should render', () => {
    const wrapper = mount(
      <TwoThumbSlider
        handleChange={() => {}}
        lowerValue={1}
        markLabels={[1, 2, 3, 4]}
        maxValue={4}
        minValue={1}
        step={1}
        upperValue={3}
      />)
    expect(wrapper).toMatchSnapshot()
  })
})
