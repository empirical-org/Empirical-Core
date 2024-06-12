import * as React from "react";
import { Input, } from '../../../Shared/index';

const INPUT_ONE = 'inputOne'
const INPUT_TWO = 'inputTwo'
const INPUT_THREE = 'inputThree'
const INPUT_FOUR = 'inputFour'

export const TextFields = () => {

  const [inputOne, setInputOne] = React.useState<string>(null);
  const [inputTwo, setInputTwo] = React.useState<string>(null);
  const [inputThree, setInputThree] = React.useState<string>('Bad input');
  const [inputFour, setInputFour] = React.useState<string>('Even worse input');

  const setterFunctions = {
    [INPUT_ONE]: setInputOne,
    [INPUT_TWO]: setInputTwo,
    [INPUT_THREE]: setInputThree,
    [INPUT_FOUR]: setInputFour,
  }

  function changeSavedValues(key, e) {
    const setterFunction = setterFunctions[key]
    setterFunction(e.target.value)
  }

  function handleClearInput(key) {
    const setterFunction = setterFunctions[key]
    setterFunction('')
  }

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
handleCancel={() => handleClearInput(INPUT_ONE)}
handleChange={(e) => {changeSavedValues('inputOne', e)}}
value={inputOne}
/>`}
            </pre>
            <Input
              handleCancel={() => handleClearInput(INPUT_ONE)}
              handleChange={(e) => {changeSavedValues(INPUT_ONE, e)}}
              label="Label"
              value={inputOne}
            />
          </div>
          <div className="big-element">
            <h4 className="style-guide-h4">Input with helper text and placeholder</h4>
            <pre>
              {`<Input
label="Label"
value={inputTwo}
handleCancel={() => handleClearInput(INPUT_TWO)}
handleChange={(e) => {changeSavedValues('inputTwo', e)}}
helperText="Helper text"
showPlaceholderWhenInactive={true}
placeholder="Placeholder"
/>`}
            </pre>
            <Input
              handleCancel={() => handleClearInput(INPUT_TWO)}
              handleChange={(e) => {changeSavedValues(INPUT_TWO, e)}}
              helperText="Helper text"
              label="Label"
              placeholder="Placeholder"
              showPlaceholderWhenInactive={true}
              value={inputTwo}
            />
          </div>
        </div>
        <div className="element-row">
          <div className="big-element">
            <h4 className="style-guide-h4">Single-line error</h4>
            <pre>
              {`<Input
label="Label"
handleCancel={() => handleClearInput(INPUT_THREE)}
handleChange={(e) => {changeSavedValues('inputThree', e)}}
value={inputThree}
error="Short error message"
/>`}
            </pre>
            <Input
              error="Short error message"
              handleCancel={() => handleClearInput(INPUT_THREE)}
              handleChange={(e) => {changeSavedValues(INPUT_THREE, e)}}
              label="Label"
              value={inputThree}
            />
          </div>
          <div className="big-element">
            <h4 className="style-guide-h4">Multi-line error</h4>
            <pre>
              {`<Input
label="Label"
value={inputFour}
handleCancel={(e) => handleClearInput(INPUT_FOUR, e)}
handleChange={(e) => {changeSavedValues('inputFour', e)}}
error="Error message
/>`}
            </pre>
            <Input
              error="Error mesage duis mollis, est non commodo luctus, nisi erat porttitor"
              handleCancel={() => handleClearInput(INPUT_FOUR)}
              handleChange={(e) => {changeSavedValues(INPUT_FOUR, e)}}
              label="Label"
              value={inputFour}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextFields
