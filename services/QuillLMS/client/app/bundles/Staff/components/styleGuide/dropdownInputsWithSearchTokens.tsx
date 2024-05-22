import * as React from 'react'

import { DropdownInputWithSearchTokens, } from '../../../Shared/index'

const options = [
  {value: 1, label: 'One'},
  {value: 2, label: 'Two'},
  {value: 3, label: 'Three'},
  {value: 4, label: 'Four'}
]

const DropdownInputsWithSearchTokens = () => {
  const [selections, setSelections] = React.useState(options)

  return (
    <div id="menus-with-search-tokens">
      <h2 className="style-guide-h2">Menus (Dropdown Inputs) with Search Tokens</h2>
      <div className="element-container">
        <pre>
          {
            `
  const [selections, setSelections] = React.useState(options)

  const options = [
    {value: 1, label: 'One'},
    {value: 2, label: 'Two'},
    {value: 3, label: 'Three'},
    {value: 4, label: 'Four'}
  ]

  return (
    <DropdownInputWithSearchTokens
      id="filter"
      identifier="value"
      label="Label"
      onChange={setSelections}
      options={options}
      optionType="option"
      value={selections}
      valueToDisplay={selections}
    />
  )`
          }
        </pre>
        <DropdownInputWithSearchTokens
          id="filter"
          identifier="value"
          label="Label"
          onChange={setSelections}
          options={options}
          optionType="option"
          value={selections}
          valueToDisplay={selections}
        />
      </div>

    </div>
  )
}

export default DropdownInputsWithSearchTokens
