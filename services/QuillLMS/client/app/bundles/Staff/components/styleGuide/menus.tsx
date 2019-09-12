import * as React from "react";
import { DropdownInput} from './dropdownInput'
// import { DropdownInput } from 'quill-component-library/dist/componentLibrary'

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
      dropdownFour: options[1]
    }

    this.changeSavedValues = this.changeSavedValues.bind(this)
  }

  changeSavedValues = (key, value) => {
    this.setState({[key]: value})
  }

  render() {
    return (<div id="menus">
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
              label="Label"
              options={options}
              handleChange={(e) => {this.changeSavedValues('dropdownOne', e)}}
              isSearchable={false}
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
              label="Label"
              value={this.state.dropdownTwo}
              options={options}
              handleChange={(e) => {this.changeSavedValues('dropdownTwo', e)}}
              isSearchable={false}
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
              label="Label"
              options={options}
              handleChange={(e) => {this.changeSavedValues('dropdownThree', e)}}
              value={this.state.dropdownThree}
              isSearchable={true}
              placeholder="Value goes here"
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
              label="Label"
              value={this.state.dropdownFour}
              isSearchable={true}
              options={options}
              handleChange={(e) => {this.changeSavedValues('dropdownFour', e)}}
            />
          </div>
        </div>
      </div>
    </div>)
  }
}

export default Menus
