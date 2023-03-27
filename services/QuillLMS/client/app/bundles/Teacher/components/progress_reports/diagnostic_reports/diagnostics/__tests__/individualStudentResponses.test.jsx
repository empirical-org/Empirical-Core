import { mount } from 'enzyme'
import React from 'react'

import {
    dummyLocationData,
    dummyMatchData, individualStudentPostTestConceptResults,
    individualStudentPostTestSkillResults, individualStudentPreTestConceptResults,
    individualStudentPreTestSkillResults
} from './test_data'

import { IndividualStudentResponses } from '../individualStudentResponses'

jest.mock('qs', () => ({
  default: {
    parse: jest.fn(() => ({}))
  }
})
)

describe('IndividualStudentResponses component', () => {
  it('should render for a pre-test', () => {
    const wrapper = mount(<IndividualStudentResponses
      location={dummyLocationData}
      match={dummyMatchData}
      mobileNavigation={<span />}
      passedConceptResults={individualStudentPreTestConceptResults}
      passedSkillResults={individualStudentPreTestSkillResults}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render for a post-test', () => {
    const wrapper = mount(<IndividualStudentResponses
      location={dummyLocationData}
      match={dummyMatchData}
      mobileNavigation={<span />}
      passedConceptResults={individualStudentPostTestConceptResults}
      passedSkillResults={individualStudentPostTestSkillResults}
    />)
    expect(wrapper).toMatchSnapshot()
  })

})
