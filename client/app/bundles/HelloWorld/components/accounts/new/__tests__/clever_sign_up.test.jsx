import React from 'react';
import { shallow } from 'enzyme';

import CleverSignUp from '../clever_sign_up'

import processEnvMock from '../../../../../../../__mocks__/processEnvMock.js';
window.process.env = processEnvMock.env;

describe('CleverSignUp component', () => {

  it('should render', () => {
    const wrapper = shallow(
        <CleverSignUp />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
