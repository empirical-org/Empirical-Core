import { shallow } from 'enzyme';
import React from 'react';

import AssigningIndicator from '../button_loading_indicator.tsx';

import processEnvMock from '../../../../../../__mocks__/processEnvMock.js';
window.process.env.CDN_URL = processEnvMock.env.CDN_URL;

describe('AssigningIndicator component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <AssigningIndicator />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
