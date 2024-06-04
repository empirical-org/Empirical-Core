import * as React from "react";

const renderElement =(classNames, buttonText) => (
  <div className="element">
    <code>{classNames}</code>
    <button className={classNames}>{buttonText}</button>
  </div>
)

const renderElementRow = (classNames) => (
  <div className="element-row">
    {renderElement(`quill-button-archived fun ${classNames}`, 'Button')}
    {renderElement(`quill-button-archived small ${classNames}`, 'Button')}
    {renderElement(`quill-button-archived medium ${classNames}`, 'Button')}
    {renderElement(`quill-button-archived medium icon ${classNames}`, '♡ Button')}
    {renderElement(`quill-button-archived large ${classNames}`, 'Button')}
    {renderElement(`quill-button-archived large icon ${classNames}`, '♡ Button')}
  </div>
)

const Buttons = () => {
  return (
    <div id="buttons">
      <h2 className="style-guide-h2">Buttons (Archived)</h2>
      <div className="element-container">
        {renderElementRow('primary contained')}
        {renderElementRow('primary outlined')}
        {renderElementRow('secondary outlined')}
        {renderElementRow('disabled contained')}
        {renderElementRow('disabled outlined')}
      </div>
    </div>
  )
}

export default Buttons
