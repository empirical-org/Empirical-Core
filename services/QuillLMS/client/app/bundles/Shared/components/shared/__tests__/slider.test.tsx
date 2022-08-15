import * as React from 'react';
import { mount } from 'enzyme';

import { TwoThumbSlider, OneThumbSlider } from '../slider'

const handleChange = () => {}

describe('TwoThumbSlider component', () => {
  it('should render', () => {
    const wrapper = mount(
      <TwoThumbSlider
        handleChange={handleChange}
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

describe('OneThumbSlider component', () => {
  it('should render when there is no value', () => {
    const wrapper = mount(
      <OneThumbSlider
        handleChange={handleChange}
        markLabels={[1, 2, 3, 4]}
        maxValue={4}
        minValue={1}
        step={1}
      />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when there is a value', () => {
    const wrapper = mount(
      <OneThumbSlider
        handleChange={handleChange}
        markLabels={[1, 2, 3, 4]}
        maxValue={4}
        minValue={1}
        step={1}
        value={2}
      />)
    expect(wrapper).toMatchSnapshot()
  })

})
