import { mount } from 'enzyme';
import * as React from 'react';

import { activities } from './data';

import ELLFilters from '../ell_filters';

function filterActivities(ignoredKey=null) { return activities }

describe('ellFilters component', () => {
  const props = {
    activities,
    ellFilters: [],
    filterActivities,
    handleELLFilterChange: (ellFilters: number[]) => {}
  }

  it('should render', () => {
    const wrapper = mount(<ELLFilters {...props} />)
    expect(wrapper).toMatchSnapshot();
  });

})
