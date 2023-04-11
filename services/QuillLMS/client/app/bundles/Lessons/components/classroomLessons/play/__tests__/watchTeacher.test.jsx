import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import WatchTeacher from '../watchTeacher';

describe('WatchTeacher component', () => {
  const wrapper = mount(<WatchTeacher /> )

  it('renders', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})
