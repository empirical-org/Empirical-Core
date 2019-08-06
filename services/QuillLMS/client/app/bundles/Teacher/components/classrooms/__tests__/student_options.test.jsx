import React from 'react';
import { shallow } from 'enzyme';

import StudentOptions from '../student_options'

describe('StudentOptions component', () => {

  const wrapper = shallow(
    <StudentOptions next={() => {}} setStudentOption={() => {}} />
  );

  it('should render StudentOptions', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
