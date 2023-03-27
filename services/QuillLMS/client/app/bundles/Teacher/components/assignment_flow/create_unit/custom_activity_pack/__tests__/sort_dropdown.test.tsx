import { mount } from 'enzyme';
import * as React from 'react';

import { DEFAULT } from '../shared';
import SortDropdown from '../sort_dropdown';

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
