import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { LinkListItem } from '../linkListItem';
;

describe('LinkListItem component', () => {
  const text = 'Fix this sentence.'
  const wrapper = mount(
    <MemoryRouter>
      <LinkListItem text={text} />
    </MemoryRouter>
  )

  it('renders an li element', () => {
    expect(wrapper.find('li')).toHaveLength(1)
  })

  it('renders the text that it was passed', () => {
    expect(wrapper.text()).toEqual(text)
  })

})
