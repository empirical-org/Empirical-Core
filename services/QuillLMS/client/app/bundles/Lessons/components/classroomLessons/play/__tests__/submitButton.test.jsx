import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import SubmitButton from '../submitButton';

describe('SubmitButton component', () => {
  const wrapper = mount(<SubmitButton /> )

  it('renders when disabled', () => {
    const wrapper = mount(<SubmitButton disabled={true} onClick={() => {}} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders when not disabled', () => {
    const wrapper = mount(<SubmitButton disabled={false} onClick={() => {}} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})
