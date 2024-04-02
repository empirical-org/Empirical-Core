import { shallow } from 'enzyme';
import * as React from 'react';

import PreviouslyAssignedTooltip from '../previouslyAssignedTooltip';

describe('PreviouslyAssignedTooltip component', () => {
  const wrapper = shallow(<PreviouslyAssignedTooltip previouslyAssignedActivityData={{ previouslyAssignedActivityData: [] }} />);

  it('should render PreviouslyAssignedTooltip', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
