import React from 'react'
import { mount } from 'enzyme'

import GrowthSummary from '../growthSummary'

describe('GrowthSummary component', () => {
  it('should render showGrowthSummary is false', () => {
    const wrapper = mount(<GrowthSummary name="Diagnostic" showGrowthSummary={false} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render showGrowthSummary is true and skillsGrowth is null', () => {
    const wrapper = mount(<GrowthSummary growthSummaryLink="" name="Diagnostic" showGrowthSummary={true} skillsGrowth={null} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render showGrowthSummary is true and skillsGrowth is 0', () => {
    const wrapper = mount(<GrowthSummary growthSummaryLink="" name="Diagnostic" showGrowthSummary={true} skillsGrowth={0} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render showGrowthSummary is true and skillsGrowth is larger than 0', () => {
    const wrapper = mount(<GrowthSummary growthSummaryLink="" name="Diagnostic" showGrowthSummary={true} skillsGrowth={18} />)
    expect(wrapper).toMatchSnapshot()
  })

})
