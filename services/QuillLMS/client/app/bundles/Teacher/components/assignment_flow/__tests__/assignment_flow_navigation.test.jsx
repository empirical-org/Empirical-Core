import React from 'react';
import { shallow } from 'enzyme';

import AssignmentFlowNavigation from '../assignment_flow_navigation'

describe('AssignmentFlowNavigation component', () => {
  const wrapper = shallow(
    <AssignmentFlowNavigation />
  );

  it('should render AssignmentFlowNavigation', () => {
    expect(wrapper).toMatchSnapshot()
  })


})
