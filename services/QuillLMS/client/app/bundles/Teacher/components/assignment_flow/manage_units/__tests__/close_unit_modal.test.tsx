import { mount } from 'enzyme';
import * as React from 'react';

import CloseUnitModal from '../close_unit_modal';

describe('CloseUnitModal component', () => {
  it('renders', () => {
    const wrapper = mount(<CloseUnitModal closeModal={jest.fn()} onSuccess={jest.fn()} unitId={1} unitName="Unit" />)
    expect(wrapper).toMatchSnapshot()
  })
})
