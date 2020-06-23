import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import ProjectorHeader from '../projectorHeader';

describe('ProjectorHeader component', () => {
  const wrapper = mount(<ProjectorHeader studentCount={1} submissions={null} /> )

  it('renders', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})
