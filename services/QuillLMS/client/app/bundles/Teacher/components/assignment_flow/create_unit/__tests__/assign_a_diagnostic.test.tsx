import * as React from 'react';
import { shallow } from 'enzyme';

import AssignADiagnostic from '../assign_a_diagnostic';
import AssignmentCard from '../assignment_card';

describe('AssignADiagnostic component', () => {

  it('should render', () => {
    expect(shallow(<AssignADiagnostic />)).toMatchSnapshot();
  });

});
