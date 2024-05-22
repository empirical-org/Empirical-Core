import * as React from 'react';

import { shallow } from 'enzyme';

import { DropdownInput } from '../../../../Shared/index';

const options = [
  {value: 1, label: 'One'},
  {value: 2, label: 'Two'},
  {value: 3, label: 'Three'},
  {value: 4, label: 'Four'}
]

describe('Dropdown input component', () => {
  it('should render when it is not searchable', () => {
    const wrapper = shallow(
      <DropdownInput
        handleChange={() => {}}
        isSearchable={false}
        label="Label"
        options={options}
        value={options[0]}
      />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when it is searchable', () => {
    const wrapper = shallow(
      <DropdownInput
        handleChange={() => {}}
        isSearchable
        label="Label"
        options={options}
        placeholder="Value goes here"
        value={options[1]}
      />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when it is multi-option', () => {
    const wrapper = shallow(
      <DropdownInput
        handleChange={() => {}}
        isMulti
        options={options}
        optionType='option'
        value={[]}
      />)
    expect(wrapper).toMatchSnapshot()
  })
})
