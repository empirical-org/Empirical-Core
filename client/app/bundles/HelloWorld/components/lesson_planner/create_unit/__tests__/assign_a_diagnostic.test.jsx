import React from 'react';
import { shallow } from 'enzyme';

import AssignADiagnostic from '../assign_a_diagnostic';

import processEnvMock from '../../../../../../../__mocks__/processEnvMock.js';
window.process = processEnvMock;

describe('AssignADiagnostic component', () => {

  it('should render', () => {
    expect(shallow(<AssignADiagnostic />)).toMatchSnapshot();
  });

});
