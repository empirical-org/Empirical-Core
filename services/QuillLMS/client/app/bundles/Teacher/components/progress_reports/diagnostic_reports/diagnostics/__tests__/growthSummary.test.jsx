import React from 'react'
import { mount } from 'enzyme'

import GrowthSummarySection from '../growthSummarySection'

describe('GrowthSummarySection component', () => {
  it('should render showGrowthSummarySection is false', () => {
    const wrapper = mount(<GrowthSummarySection name="Diagnostic" showGrowthSummary={false} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render showGrowthSummarySection is true and skillsGrowth is null', () => {
    const wrapper = mount(<GrowthSummarySection growthSummaryLink="" name="Diagnostic" showGrowthSummary={true} skillsGrowth={null} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render showGrowthSummarySection is true and skillsGrowth is 0', () => {
    const wrapper = mount(<GrowthSummarySection growthSummaryLink="" name="Diagnostic" showGrowthSummary={true} skillsGrowth={0} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render showGrowthSummarySection is true and skillsGrowth is larger than 0', () => {
    const wrapper = mount(<GrowthSummarySection growthSummaryLink="" name="Diagnostic" showGrowthSummary={true} skillsGrowth={18} />)
    expect(wrapper).toMatchSnapshot()
  })

})
