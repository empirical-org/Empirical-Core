import React from 'react';
import { mount } from 'enzyme';

import PromptListItem from '../promptListItem.jsx';

describe('PromptListItem component', () => {
  const prompt = 'Fix this sentence.'
  const wrapper = mount(<PromptListItem prompt={prompt} /> )

  it('renders an li element', () => {
    expect(wrapper.find('li')).toHaveLength(1)
  })

  it('renders the prompt that it was passed', () => {
    expect(wrapper.text()).toEqual(prompt)
  })

})
