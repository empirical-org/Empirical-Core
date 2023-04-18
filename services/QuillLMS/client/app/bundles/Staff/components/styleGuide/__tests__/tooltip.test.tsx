import * as React from 'react';

import { mount } from 'enzyme';

import { Tooltip } from '../../../../Shared/index';

describe('Tooltip component', () => {
  it('should render when it is not searchable', () => {
    const wrapper = mount(
      <Tooltip
        tooltipText="I am a tooltip"
        tooltipTriggerText="I have a lot of text"
      />)
    expect(wrapper).toMatchSnapshot()
  })
})
