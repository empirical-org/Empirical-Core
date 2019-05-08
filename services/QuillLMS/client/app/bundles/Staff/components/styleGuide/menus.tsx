import * as React from "react";
import { DropdownInput } from 'quill-component-library/dist/componentLibrary'

const Cards = () => {

  const options = [
    {value: 1, label: 'One'},
    {value: 2, label: 'Two'},
    {value: 3, label: 'Three'}
  ]

  return (<div id="cards">
    <h2>Menus</h2>
    <div className="element-container">
      <h3>Dropdown Menu</h3>
      <div className="element-row">
        <div className="big-element">
          <pre>
            {`
              const options = ${options}

              <DropdownInput
                label="Concept"
                options={options}
                handleChange={() => {}}
                isSearchable={false}
            />`}
          </pre>
          <DropdownInput
            label="Concept"
            options={options}
            handleChange={() => {}}
            isSearchable={false}
          />
        </div>
        <div className="big-element">
          <pre>
            {`
              const options = ${options}

              <DropdownInput
                label="Concept"
                value={options[0]}
                options={options}
                handleChange={() => {}}
                isSearchable={false}
            />`}
          </pre>
          <DropdownInput
            label="Concept"
            value={options[0]}
            options={options}
            handleChange={() => {}}
            isSearchable={false}
          />
        </div>
      </div>
    </div>
  </div>)
}

export default Cards
