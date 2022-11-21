import React from 'react';
import { shallow } from 'enzyme';

import PreviouslyAssignedTooltip from '../previouslyAssignedTooltip'

describe('PreviouslyAssignedTooltip component', () => {
  const wrapper = shallow(<PreviouslyAssignedTooltip  previouslyAssignedActivityData={{ previouslyAssignedActivityData: [] }} />);

  it('should render PreviouslyAssignedTooltip', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
