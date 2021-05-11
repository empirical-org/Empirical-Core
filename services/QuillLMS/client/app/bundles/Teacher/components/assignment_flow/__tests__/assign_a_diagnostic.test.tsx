import * as React from 'react';
import { shallow } from 'enzyme';

import AssignADiagnostic from '../create_unit/assign_a_diagnostic';
import AssignmentCard from '../create_unit/assignment_card';

describe('AssignADiagnostic component', () => {
  const component = shallow(<AssignADiagnostic />);

  it('should render AssignADiagnostic', () => {
    expect(component).toMatchSnapshot();
  });
  it('should render 10 AssignmentCard components', ()=> {
    expect(component.find(AssignmentCard)).toHaveLength(10);
  })
});
