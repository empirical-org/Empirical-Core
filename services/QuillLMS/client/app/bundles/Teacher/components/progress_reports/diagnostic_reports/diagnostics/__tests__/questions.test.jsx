import React from 'react'
import { mount } from 'enzyme'

import {
  dummyLocationData,
  dummyMatchData,
  passedQuestionsWithNoStudentData,
  passedQuestionsWithStudentData,
} from './test_data'

import { Questions, } from '../questions'

jest.mock('qs', () => ({
  default: {
    parse: jest.fn(() => ({}))
  }
})
)

jest.mock('string-strip-html', () => ({
  default: (str) => str 
}));

describe('Questions component', () => {
  it('should render when there is no student data', () => {
    const wrapper = mount(<Questions
      location={dummyLocationData}
      match={dummyMatchData}
      mobileNavigation={<span />}
      passedQuestions={passedQuestionsWithNoStudentData}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when there is student data', () => {
    const wrapper = mount(<Questions
      location={dummyLocationData}
      match={dummyMatchData}
      mobileNavigation={<span />}
      passedQuestions={passedQuestionsWithStudentData}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
