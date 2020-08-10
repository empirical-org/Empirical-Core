import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import WatchTeacher from '../watchTeacher';

describe('WatchTeacher component', () => {
  const wrapper = mount(<WatchTeacher /> )

  it('renders', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})
