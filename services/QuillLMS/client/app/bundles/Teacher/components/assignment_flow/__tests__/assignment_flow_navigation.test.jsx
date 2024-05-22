import { shallow } from 'enzyme';
import React from 'react';

import AssignmentFlowNavigation from '../assignment_flow_navigation';

describe('AssignmentFlowNavigation component', () => {
  const wrapper = shallow(
    <AssignmentFlowNavigation />
  );

  it('should render AssignmentFlowNavigation', () => {
    expect(wrapper).toMatchSnapshot()
  })


})
