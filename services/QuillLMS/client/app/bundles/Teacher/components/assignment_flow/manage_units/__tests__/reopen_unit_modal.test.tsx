import { mount } from 'enzyme';
import * as React from 'react';

import ReopenUnitModal from '../reopen_unit_modal';

describe('ReopenUnitModal component', () => {
  it('renders', () => {
    const wrapper = mount(<ReopenUnitModal closeModal={jest.fn()} onSuccess={jest.fn()} unitId={1} unitName="Unit" />)
    expect(wrapper).toMatchSnapshot()
  })
})
