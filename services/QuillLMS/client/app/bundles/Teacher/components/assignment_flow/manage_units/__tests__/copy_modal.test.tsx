import { mount } from 'enzyme';
import * as React from 'react';

import CopyModal from '../copy_modal';

describe('CopyModal component', () => {
  it('renders', () => {
    const wrapper = mount(<CopyModal attributeName="publish date" closeFunction={() => {}} copyFunction={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
