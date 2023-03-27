import { mount } from 'enzyme'
import React from 'react'

import {
    dummyLocationData,
    dummyMatchData, resultsSummarySkillGroupSummaries,
    resultsSummarySkillGroupSummariesNoData, resultsSummaryStudentResults, resultsSummaryStudentResultsNoData
} from './test_data'

import { Results } from '../results'

jest.mock('qs', () => ({
  default: {
    parse: jest.fn(() => ({}))
  }
})
)

describe('Results component', () => {
  it('should render when there are results', () => {
    const wrapper = mount(<Results
      location={dummyLocationData}
      match={dummyMatchData}
      mobileNavigation={<span />}
      passedSkillGroupSummaries={resultsSummarySkillGroupSummaries}
      passedStudentResults={resultsSummaryStudentResults}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when there are no results', () => {
    const wrapper = mount(<Results
      location={dummyLocationData}
      match={dummyMatchData}
      mobileNavigation={<span />}
      passedSkillGroupSummaries={resultsSummarySkillGroupSummariesNoData}
      passedStudentResults={resultsSummaryStudentResultsNoData}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
