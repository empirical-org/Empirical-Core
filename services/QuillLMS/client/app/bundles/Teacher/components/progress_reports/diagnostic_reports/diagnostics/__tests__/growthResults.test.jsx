import React from 'react'
import { mount } from 'enzyme'
import * as $ from 'jquery'

import {
  growthSummaryStudentResults,
  growthSummarySkillGroupSummaries,
  growthSummarySkillGroupSummariesNoData,
  growthSummaryStudentResultsNoData,
} from './test_data'

import GrowthResults from '../growth_results'

describe('GrowthResults component', () => {
  it('should render when there are results', () => {
    const wrapper = mount(<GrowthResults
      match={{}}
      mobileNavigation={<span />}
      passedSkillGroupSummaries={growthSummarySkillGroupSummaries}
      passedStudentResults={growthSummaryStudentResults}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when there are no results', () => {
    const wrapper = mount(<GrowthResults
      match={{}}
      mobileNavigation={<span />}
      passedSkillGroupSummaries={growthSummarySkillGroupSummariesNoData}
      passedStudentResults={growthSummaryStudentResultsNoData}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
