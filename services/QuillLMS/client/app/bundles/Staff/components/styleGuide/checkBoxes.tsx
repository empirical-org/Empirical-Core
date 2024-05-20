import * as React from 'react';
import _ from 'lodash';

const STATES = ['inactive', 'active', 'indeterminate', 'disabled']
const MODES = ['On Light', 'On Dark']

const Checkboxes = () => {
  return(
    <div id="checkboxes">
      <h2 className="style-guide-h2">Checkboxes</h2>
      <div className="states-and-modes-container">
        <h4 className="style-guide-h4">States</h4>
        <div className="options-container">
          {STATES.map(state => {
            return(
              <div className="option-container">
                <p className="option-label">{_.capitalize(state)}</p>
              </div>
            )
          })}
        </div>
        <h4 className="style-guide-h4">Modes</h4>
        <div className="options-container">
          {MODES.map(mode => {
            return (
              <div className="option-container">
                <p className="option-label">{mode}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Checkboxes
