import * as React from "react";
import { Input } from '../../../Shared/index';

class TextFields extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      inputOne: null,
      inputTwo: null,
      inputThree: 'Bad input',
      inputFour: 'Even worse input'
    }

    this.changeSavedValues = this.changeSavedValues.bind(this)
  }

  changeSavedValues = (key, e) => {
    this.setState({[key]: e.target.value})
  }

  render() {
    return (
      <div id="textFields">
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
                handleChange={(e) => {this.changeSavedValues('inputOne', e)}}
                label="Label"
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
                handleChange={(e) => {this.changeSavedValues('inputTwo', e)}}
                helperText="Helper text"
                label="Label"
                placeholder="Placeholder"
                value={this.state.inputTwo}
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
                error="Short error message"
                handleChange={(e) => {this.changeSavedValues('inputThree', e)}}
                label="Label"
                value={this.state.inputThree}
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
                error="Error mesage duis mollis, est non commodo luctus, nisi erat porttitor"
                handleChange={(e) => {this.changeSavedValues('inputFour', e)}}
                label="Label"
                value={this.state.inputFour}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TextFields
