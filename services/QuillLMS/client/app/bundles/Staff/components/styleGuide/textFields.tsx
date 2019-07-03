import * as React from "react";
import { Input } from './input'
// import { Input } from 'quill-component-library/dist/componentLibrary'

class TextFields extends React.Component<any, any> {

  constructor(props) {
    super(props)

    this.state = {
      inputOne: null,
      inputTwo: null,
      inputThree: 'Bad input',
      inputFour: 'Even worse input',
      inputFive: "Can't change me",
      inputSix: 'Not at character limit'
    }

    this.changeSavedValues = this.changeSavedValues.bind(this)
  }

  changeSavedValues = (key, e) => {
    this.setState({[key]: e.target.value})
  }

  render() {
    return (<div id="textFields">
      <h2 className="style-guide-h2">Text Fields</h2>
      <div className="element-container">
        <div className="element-row">
          <div className="big-element">
            <h4 className="style-guide-h4">Input</h4>
            <pre>
{`<Input
  label="Label"
  handleChange={(e) => {this.changeSavedValues('inputOne', e)}}
  value={this.state.inputOne}
/>`}
            </pre>
            <Input
              label="Label"
              handleChange={(e) => {this.changeSavedValues('inputOne', e)}}
              value={this.state.inputOne}
            />
          </div>
          <div className="big-element">
            <h4 className="style-guide-h4">Input with helper text and placeholder</h4>
            <pre>
{`<Input
  label="Label"
  value={this.state.inputTwo}
  handleChange={(e) => {this.changeSavedValues('inputTwo', e)}}
  helperText="Helper text"
  placeholder="Placeholder"
/>`}
            </pre>
            <Input
              label="Label"
              value={this.state.inputTwo}
              handleChange={(e) => {this.changeSavedValues('inputTwo', e)}}
              helperText="Helper text"
              placeholder="Placeholder"
            />
          </div>
        </div>
        <div className="element-row">
          <div className="big-element">
            <h4 className="style-guide-h4">Single-line error</h4>
            <pre>
{`<Input
  label="Label"
  handleChange={(e) => {this.changeSavedValues('inputThree', e)}}
  value={this.state.inputThree}
  error="Short error message"
/>`}
            </pre>
            <Input
              label="Label"
              handleChange={(e) => {this.changeSavedValues('inputThree', e)}}
              value={this.state.inputThree}
              error="Short error message"
            />
          </div>
          <div className="big-element">
          <h4 className="style-guide-h4">Multi-line error</h4>
            <pre>
{`<Input
  label="Label"
  value={this.state.inputFour}
  handleChange={(e) => {this.changeSavedValues('inputFour', e)}}
  error="Error message
/>`}
            </pre>
            <Input
              label="Label"
              value={this.state.inputFour}
              handleChange={(e) => {this.changeSavedValues('inputFour', e)}}
              error="Error mesage duis mollis, est non commodo luctus, nisi erat porttitor"
            />
          </div>
        </div>
        <div className="element-row">
          <div className="big-element">
            <h4 className="style-guide-h4">Disabled with no label</h4>
            <pre>
{`<Input
  disabled={true}
  value={this.state.inputFive}
/>`}
            </pre>
            <Input
              disabled={true}
              value={this.state.inputFive}
            />
          </div>
          <div className="big-element">
            <h4 className="style-guide-h4">With character limit</h4>
            <pre>
{`<Input
  label='Label'
  characterLimit={50}
  value={this.state.inputSix}
  handleChange={(e) => {this.changeSavedValues('inputFour', e)}}
/>`}
            </pre>
            <Input
              label='Label'
              characterLimit={50}
              value={this.state.inputSix}
              handleChange={(e) => {this.changeSavedValues('inputSix', e)}}
            />
          </div>
        </div>
      </div>
    </div>)
  }
}

export default TextFields
