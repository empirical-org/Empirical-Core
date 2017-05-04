import React from 'react';
import { mount } from 'enzyme';

import FillInBlankListItem from '../fillInBlankListItem.jsx';

describe('FillInBlankListItem component', () => {

  const prompt = "We arrived ___ school before the bell rang."
  const identifier = '123'

  const wrapper = mount(<FillInBlankListItem identifier={identifier} prompt={prompt}/>)
  it('renders an li', () => {
    expect(wrapper.find('li')).toHaveLength(1)
  })

  it('renders the passed prompt as text', () => {
    expect(wrapper.text()).toEqual(prompt)
  })
})
