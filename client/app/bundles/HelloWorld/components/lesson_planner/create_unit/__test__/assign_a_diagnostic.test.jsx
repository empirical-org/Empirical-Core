import React from 'react';
import { shallow } from 'enzyme';

import AssignADiagnostic from '../assign_a_diagnostic';

describe('AssignADiagnostic component', () => {

  it('should render', () => {
    expect(shallow(<AssignADiagnostic />)).toMatchSnapshot();
  });

});
