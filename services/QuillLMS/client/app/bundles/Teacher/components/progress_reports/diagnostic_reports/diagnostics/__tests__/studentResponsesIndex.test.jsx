import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  dummyLocationData,
  dummyMatchData,
  passedStudentsWithNoStudentData,
  passedStudentsWithStudentData,
} from './test_data';

import { StudentResponsesIndex, } from '../studentResponsesIndex';

describe('StudentResponsesIndex component', () => {
  it('should render when there is no student data', () => {
    const { asFragment } = render(<Router>
      <StudentResponsesIndex
        location={dummyLocationData}
        match={dummyMatchData}
        mobileNavigation={<span />}
        passedStudents={passedStudentsWithNoStudentData}
      />
    </Router>)
    expect(asFragment()).toMatchSnapshot();
  })

  it('should render when there is student data', () => {
    const { asFragment } = render(<Router>
      <StudentResponsesIndex
        location={dummyLocationData}
        match={dummyMatchData}
        mobileNavigation={<span />}
        passedStudents={passedStudentsWithStudentData}
      />
    </Router>)
    expect(asFragment()).toMatchSnapshot();
  })
})
