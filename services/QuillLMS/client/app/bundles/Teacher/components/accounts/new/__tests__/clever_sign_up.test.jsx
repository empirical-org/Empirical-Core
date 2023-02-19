import React from 'react';
import { shallow } from 'enzyme';

import CleverSignUp from '../clever_sign_up'

import processEnvMock from '../../../../../../../__mocks__/processEnvMock.js';
window.import.meta.env.VITE_PROCESS_ENV_CDN_URL = processEnvMock.env.CDN_URL;

describe('CleverSignUp component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <CleverSignUp />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
