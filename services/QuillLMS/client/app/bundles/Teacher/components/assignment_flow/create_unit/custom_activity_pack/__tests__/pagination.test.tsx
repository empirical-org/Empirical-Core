import * as React from 'react'
import { mount } from 'enzyme';

import { activities } from './data'

import Pagination from '../pagination'

describe('Pagination component', () => {
  const props = {
    activities: activities,
    currentPage: 0,
    setCurrentPage: (currentPage: number) => {}
  }

  it('should render', () => {
    const wrapper = mount(<Pagination {...props} />)
    expect(wrapper).toMatchSnapshot();
  });
})
