import * as React from 'react'
import { mount } from 'enzyme';

import { activities } from './data'

import CCSSGradeLevelFilters from '../ccss_grade_level_filters'

describe('ccssGradeLevelFilters component', () => {
  const props = {
    ccssGradeLevelFilters: [],
    handleCCSSGradeLevelFilterChange: (ccssGradeLevelFilters: number[]) => {}
  }

  it('should render', () => {
    const wrapper = mount(<CCSSGradeLevelFilters {...props} />)
    expect(wrapper).toMatchSnapshot();
  });

})
