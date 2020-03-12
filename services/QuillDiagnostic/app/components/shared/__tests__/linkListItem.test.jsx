import React from 'react';
import { mount } from 'enzyme';

import { LinkListItem } from 'quill-component-library/dist/componentLibrary';;

describe('LinkListItem component', () => {
  const text = 'Fix this sentence.'
  const wrapper = mount(<LinkListItem text={text} /> )

  it('renders an li element', () => {
    expect(wrapper.find('li')).toHaveLength(1)
  })

  it('renders the text that it was passed', () => {
    expect(wrapper.text()).toEqual(text)
  })

})
