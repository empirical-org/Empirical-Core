import { mount } from 'enzyme';
import * as React from 'react';

import ActivityPackUpdateButtons from '../activity_pack_update_buttons';

const props = {
  handleClickShareActivityPack: jest.fn(),
  handleClickShowRename: jest.fn(),
  handleClickShowRemove: jest.fn(),
  handleClickShowReopenUnit: jest.fn(),
  handleClickShowCloseUnit: jest.fn(),
}

describe('ActivityPackUpdateButtons component', () => {
  it('renders when the pack is open', () => {
    const wrapper = mount(<ActivityPackUpdateButtons {...props} isOpen={true} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders when the pack is closed', () => {
    const wrapper = mount(<ActivityPackUpdateButtons {...props} isOpen={false} />)
    expect(wrapper).toMatchSnapshot()
  })
})
