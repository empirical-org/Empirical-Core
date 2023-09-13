import { mount } from 'enzyme';
import React from 'react';

import LandingPage from '../landing_page.jsx';

describe('LandingPage component', () => {
  const wrapper = mount(
    <LandingPage   />
  );

  it('matches the snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  });
})
