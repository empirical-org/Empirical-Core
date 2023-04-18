import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import AbsentTeacher from '../absentTeacher';

describe('AbsentTeacher component', () => {
  const wrapper = mount(<AbsentTeacher /> )

  it('renders', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})
