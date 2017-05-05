import React from 'react';
import { mount } from 'enzyme';

import ConceptListItem from '../conceptListItem.jsx';

describe('ConceptListItem component', () => {
  const displayName = 'Adjectives'
  const wrapper = mount(<ConceptListItem displayName={displayName} /> )

  it('renders an li element', () => {
    expect(wrapper.find('li')).toHaveLength(1)
  })

  it('renders the displayName that it was passed', () => {
    expect(wrapper.text()).toEqual(displayName)
  })

})
