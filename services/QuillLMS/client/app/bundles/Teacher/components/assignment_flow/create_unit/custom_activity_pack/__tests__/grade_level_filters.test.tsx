import * as React from 'react'
import { mount } from 'enzyme';

import { activities } from './data'

import GradeLevelFilters from '../grade_level_filters'
import NumberSuffixBuilder from '../../../../modules/NumberSuffixBuilder.js'

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
