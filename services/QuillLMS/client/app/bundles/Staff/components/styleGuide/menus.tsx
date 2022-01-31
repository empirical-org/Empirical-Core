import * as React from "react";
import { DropdownInput } from '../../../Shared/index'

const options = [
  {value: 1, label: 'One'},
  {value: 2, label: 'Two'},
  {value: 3, label: 'Three'},
  {value: 4, label: 'Four'}
]

class Menus extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      dropdownOne: null,
      dropdownTwo: options[0],
      dropdownThree: null,
      dropdownFour: options[1],
      dropdownFive: []
    }

    this.changeSavedValues = this.changeSavedValues.bind(this)
  }

  changeSavedValues = (key, value) => {
    this.setState({[key]: value})
  }

  render() {
    return (
      <div id="menus">
        <h2 className="style-guide-h2">Menus</h2>
        <div className="element-container">
          <h3 className="style-guide-h3">Dropdown Menu</h3>
          <div className="element-row">
            <div className="big-element">
              <pre>
                {`const options = ${JSON.stringify(options)}

<DropdownInput
  label="Label"
  options={options}
  handleChange={(e) => {this.changeSavedValues('dropdownOne', e)}}
  isSearchable={false}
  value={this.state.dropdownOne}
/>`}
              </pre>
              <DropdownInput
                handleChange={(e) => {this.changeSavedValues('dropdownOne', e)}}
                isSearchable={false}
                label="Label"
                options={options}
                value={this.state.dropdownOne}
              />
            </div>
            <div className="big-element">
              <pre>
                {`const options = ${JSON.stringify(options)}

<DropdownInput
  label="Label"
  value={this.state.dropdownTwo}
  options={options}
  handleChange={(e) => {this.changeSavedValues('dropdownTwo', e)}}
  isSearchable={false}
/>`}
              </pre>
              <DropdownInput
                handleChange={(e) => {this.changeSavedValues('dropdownTwo', e)}}
                isSearchable={false}
                label="Label"
                options={options}
                value={this.state.dropdownTwo}
              />
            </div>
          </div>
          <h3 className="style-guide-h3">Exposed Editable Dropdown Menu</h3>
          <div className="element-row">
            <div className="big-element">
              <pre>
                {`const options = ${JSON.stringify(options)}

<DropdownInput
  label="Label"
  options={options}
  handleChange={(e) => {this.changeSavedValues('dropdownThree', e)}}
  value={this.state.dropdownThree}
  isSearchable={true}
  placeholder="Value goes here"
/>`}
              </pre>
              <DropdownInput
                handleChange={(e) => {this.changeSavedValues('dropdownThree', e)}}
                isSearchable={true}
                label="Label"
                options={options}
                placeholder="Value goes here"
                value={this.state.dropdownThree}
              />
            </div>
            <div className="big-element">
              <pre>
                {`const options = ${JSON.stringify(options)}

<DropdownInput
  label="Label"
  value={this.state.dropdownFour}
  isSearchable={true}
  options={options}
  handleChange={(e) => {this.changeSavedValues('dropdownFour', e)}}
/>`}
              </pre>
              <DropdownInput
                handleChange={(e) => {this.changeSavedValues('dropdownFour', e)}}
                isSearchable={true}
                label="Label"
                options={options}
                value={this.state.dropdownFour}
              />
            </div>
          </div>
          <h3 className="style-guide-h3">Uneditable Checkbox Dropdown Menu</h3>
          <div className="element-row">
            <div className="big-element">
              <pre>
                {`const options = ${JSON.stringify(options)}

<DropdownInput
value={this.state.dropdownFive}
isMulti={true}
options={options}
optionType='option'
handleChange={(e) => {this.changeSavedValues('dropdownFive', e)}}
/>`}
              </pre>
              <DropdownInput
                handleChange={(e) => {this.changeSavedValues('dropdownFive', e)}}
                isMulti={true}
                options={options}
                optionType='option'
                value={this.state.dropdownFive}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Menus
