import React from 'react';
import { mount } from 'enzyme';

import QuestionListItem from '../questionListItem.jsx';

describe('QuestionListItem component', () => {
  const prompt = 'Fix this sentence.'
  const wrapper = mount(<QuestionListItem prompt={prompt} /> )

  it('renders an li element', () => {
    expect(wrapper.find('li')).toHaveLength(1)
  })

  it('renders the prompt that it was passed', () => {
    expect(wrapper.text()).toEqual(prompt)
  })

})
