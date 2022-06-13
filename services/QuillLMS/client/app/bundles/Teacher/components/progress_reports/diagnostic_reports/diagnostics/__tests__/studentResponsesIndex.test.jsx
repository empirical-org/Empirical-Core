import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme'
import * as $ from 'jquery'

import {
  dummyLocationData,
  dummyMatchData,
  passedStudentsWithNoStudentData,
  passedStudentsWithStudentData,
} from './test_data'

import { StudentResponsesIndex, } from '../studentResponsesIndex'

jest.mock('qs', () => ({
  default: {
    parse: jest.fn(() => ({}))
  }
})
)

describe('StudentResponsesIndex component', () => {
  it('should render when there is no student data', () => {
    const wrapper = mount(<Router>
      <StudentResponsesIndex
        location={dummyLocationData}
        match={dummyMatchData}
        mobileNavigation={<span />}
        passedStudents={passedStudentsWithNoStudentData}
      />
    </Router>)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when there is student data', () => {
    const wrapper = mount(<Router>
      <StudentResponsesIndex
        location={dummyLocationData}
        match={dummyMatchData}
        mobileNavigation={<span />}
        passedStudents={passedStudentsWithStudentData}
      />
    </Router>)
    expect(wrapper).toMatchSnapshot()
  })
})
