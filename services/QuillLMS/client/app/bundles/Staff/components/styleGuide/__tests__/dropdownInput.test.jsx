import * as React from 'react';

import { shallow } from 'enzyme';

import { DropdownInput } from 'quill-component-library/dist/componentLibrary'

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
        label="Label"
        options={options}
        handleChange={() => {}}
        isSearchable={false}
        value={options[0]}
      />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when it is searchable', () => {
    const wrapper = shallow(
      <DropdownInput
        label="Label"
        options={options}
        handleChange={() => {}}
        value={options[1]}
        isSearchable
        placeholder="Value goes here"
      />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when it is multi-option', () => {
    const wrapper = shallow(
      <DropdownInput
        isMulti
        options={options}
        optionType='option'
        handleChange={() => {}}
        value={[]}
      />)
    expect(wrapper).toMatchSnapshot()
  })
})
