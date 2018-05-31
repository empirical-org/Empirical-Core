import React from 'react';
import { shallow } from 'enzyme';

import AssigningIndicator from '../button_loading_indicator';

import processEnvMock from '../../../../../../__mocks__/processEnvMock.js';
window.process = processEnvMock;

describe('AssigningIndicator component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <AssigningIndicator />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
