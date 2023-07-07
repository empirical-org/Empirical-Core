import { mount } from 'enzyme';
import * as React from 'react'

import { DropdownInputWithSearchTokens } from '../dropdownInputWithSearchTokens'

const options = [
  {value: 1, label: 'One'},
  {value: 2, label: 'Two'},
  {value: 3, label: 'Three'},
  {value: 4, label: 'Four'}
]

const props = {
  id: "filter",
  identifier: "value",
  label: "Label",
  optionType: "option",
  options,
  onChange: jest.fn(),
  value: options,
  valueToDisplay: options,
}

describe('DropdownInputWithSearchTokens', () => {
  it('should render', () => {
    const wrapper = mount(<DropdownInputWithSearchTokens {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
