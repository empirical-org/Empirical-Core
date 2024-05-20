import * as React from 'react';

const STATES = ['inactive', 'active', 'indeterminate', 'disabled']

const Checkboxes = () => {
  return(
    <div id="checkboxes">
      <h2 className="style-guide-h2">Checkboxes</h2>
      <div className="States-container">
        <h4 className="style-guide-h4">States</h4>
        <div className="States-options-container">
          {STATES.map(state => {
            return(
              <div className="state">
                <p className="state-label">{state}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className="modes-container">
        <h4 className="style-guide-h4">Modes</h4>
      </div>
    </div>
  )
}

export default Checkboxes
