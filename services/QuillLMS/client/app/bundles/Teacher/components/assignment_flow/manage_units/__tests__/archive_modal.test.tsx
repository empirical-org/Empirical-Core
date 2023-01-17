import * as React from 'react';
import { mount } from 'enzyme';

import ArchiveModal from '../archive_modal';

describe('ArchiveModal component', () => {
  it('renders', () => {
    const wrapper = mount(<ArchiveModal closeModal={jest.fn()} onSuccess={jest.fn()} unitId={1} unitName="Unit" />)
    expect(wrapper).toMatchSnapshot()
  })
})
