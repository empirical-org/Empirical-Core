import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import { PROJECT } from '../constants';
import PromptSection from '../promptSection';

describe('PromptSection component', () => {

  it('renders with no explicit mode set', () => {
    const wrapper = mount(<PromptSection mode={null} promptElement={<div />} /> )
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders with PROJECT mode set', () => {
    const wrapper = mount(<PromptSection mode={PROJECT} promptElement={<div />} /> )
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})
