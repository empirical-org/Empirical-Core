import { shallow } from 'enzyme';
import React from 'react';

import AssigningIndicator from '../button_loading_indicator';

import processEnvMock from '../../../../../../__mocks__/processEnvMock.js';
window.import.meta.env.VITE_PROCESS_ENV_CDN_URL = processEnvMock.env.CDN_URL;

describe('AssigningIndicator component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <AssigningIndicator />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
