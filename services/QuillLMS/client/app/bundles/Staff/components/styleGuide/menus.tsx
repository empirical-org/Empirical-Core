import * as React from "react";
import { DropdownInput } from 'quill-component-library/dist/componentLibrary'

const options = [
  {value: 1, label: 'One'},
  {value: 2, label: 'Two'},
  {value: 3, label: 'Three'}
]

class Cards extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      dropdownOne: null,
      dropdownTwo: options[0]
    }

    this.changeSavedValues = this.changeSavedValues.bind(this)
  }

  changeSavedValues = (key, value) => {
    this.setState({[key]: value})
  }

  render() {
    return (<div id="cards">
      <h2>Menus</h2>
      <div className="element-container">
        <h3>Dropdown Menu</h3>
        <div className="element-row">
          <div className="big-element">
            <pre>
              {`
                const options = ${JSON.stringify(options)}

                <DropdownInput
                  label="Concept"
                  options={options}
                  handleChange={(e) => {this.changeSavedValues('dropdownOne', e)}}
                  isSearchable={false}
                  value={this.state.dropdownOne}
              />`}
            </pre>
            <DropdownInput
              label="Concept"
              options={options}
              handleChange={(e) => {this.changeSavedValues('dropdownOne', e)}}
              isSearchable={false}
              value={this.state.dropdownOne}
            />
          </div>
          <div className="big-element">
            <pre>
              {`
                const options = ${JSON.stringify(options)}

                <DropdownInput
                  label="Concept"
                  value={this.state.dropdownTwo}
                  options={options}
                  handleChange={(e) => {this.changeSavedValues('dropdownTwo', e)}}
                  isSearchable={false}
              />`}
            </pre>
            <DropdownInput
              label="Concept"
              value={this.state.dropdownTwo}
              options={options}
              handleChange={(e) => {this.changeSavedValues('dropdownTwo', e)}}
              isSearchable={false}
            />
          </div>
        </div>
      </div>
    </div>)
  }
}

export default Cards
