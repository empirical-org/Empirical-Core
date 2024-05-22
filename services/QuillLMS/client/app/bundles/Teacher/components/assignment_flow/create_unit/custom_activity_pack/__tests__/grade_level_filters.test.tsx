import { mount } from 'enzyme';
import * as React from 'react';


import GradeLevelFilters from '../grade_level_filters';

describe('gradeLevelFilters component', () => {
  const props = {
    gradeLevelFilters: [],
    handleGradeLevelFilterChange: (gradeLevelFilters: number[]) => {}
  }

  it('should render', () => {
    const wrapper = mount(<GradeLevelFilters {...props} />)
    expect(wrapper).toMatchSnapshot();
  });

})
