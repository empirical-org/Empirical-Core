import React from 'react';
import { shallow } from 'enzyme';

import ActivityPacks from '../activity_packs.jsx'

import processEnvMock from '../../../../../../../__mocks__/processEnvMock.js';
window.process = processEnvMock;

describe('ActivityPacks component', () => {

  it('should render', () => {
    document.body.innerHTML =
  '<div>' +
  '  <div class="diagnostic-tab" />' +
  '  <button class="activity-analysis-tab" />' +
  '</div>';

    const wrapper = shallow(
        <ActivityPacks />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
