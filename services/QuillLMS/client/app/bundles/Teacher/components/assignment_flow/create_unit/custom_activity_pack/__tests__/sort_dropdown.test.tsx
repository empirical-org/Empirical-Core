import * as React from 'react'
import { mount } from 'enzyme';

import SortDropdown from '../sort_dropdown'
import { DEFAULT, } from '../shared'

describe('SortDropdown component', () => {
  const props = {
    sort: DEFAULT,
    setSort: (sort: string) => {}
  }

  it('should render', () => {
    const wrapper = mount(<SortDropdown {...props} />)
    expect(wrapper).toMatchSnapshot();
  });
})
