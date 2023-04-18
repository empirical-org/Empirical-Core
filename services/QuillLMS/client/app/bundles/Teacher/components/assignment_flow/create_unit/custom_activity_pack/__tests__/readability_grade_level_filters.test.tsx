import { mount } from 'enzyme';
import * as React from 'react';


import ReadabilityGradeLevelFilters from '../readability_grade_level_filters';

describe('readabilityGradeLevelFilters component', () => {
  const props = {
    readabilityGradeLevelFilters: [],
    handleReadabilityGradeLevelFilterChange: (readabilityGradeLevelFilters: number[]) => {}
  }

  it('should render', () => {
    const wrapper = mount(<ReadabilityGradeLevelFilters {...props} />)
    expect(wrapper).toMatchSnapshot();
  });

})
