import { mount } from 'enzyme'
import React from 'react'

import {
    growthSummarySkillGroupSummaries,
    growthSummarySkillGroupSummariesNoData, growthSummaryStudentResults, growthSummaryStudentResultsNoData
} from './test_data'

import StudentResultsTable from '../studentResultsTable'

describe('StudentResultsTable component', () => {
  it('should render when there is no student data', () => {
    const wrapper = mount(<StudentResultsTable
      openPopover={{}}
      responsesLink={() => ''}
      setOpenPopover={() => {}}
      skillGroupSummaries={growthSummarySkillGroupSummariesNoData}
      studentResults={growthSummaryStudentResultsNoData}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when there is student data', () => {
    const wrapper = mount(<StudentResultsTable
      openPopover={{}}
      responsesLink={() => ''}
      setOpenPopover={() => {}}
      skillGroupSummaries={growthSummarySkillGroupSummaries}
      studentResults={growthSummaryStudentResults}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
