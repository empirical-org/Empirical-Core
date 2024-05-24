import * as React from 'react';
import _ from 'lodash';
import { ACTIVE, Checkbox, DISABLED, INACTIVE, INDETERMINATE } from '../../../Shared';

const STATES = [INACTIVE, ACTIVE, INDETERMINATE, DISABLED]

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
                <Checkbox
                  label="Text"
                  onClick={() => {}}
                  selected={state === ACTIVE}
                  state={state}
                />
              </div>
            )
          })}
        </div>
        <h4 className="style-guide-h4">Modes</h4>
        <div className="options-container">
          <div className="option-container">
            <p className="option-label">On Light</p>
            <div className="checkboxes">
              <Checkbox
                label="Text"
                selected={false}
              />
              <Checkbox
                label="Text"
                selected={true}
              />
            </div>
          </div>
          <div className="option-container dark">
            <p className="option-label">On Dark</p>
            <div className="checkboxes">
              <Checkbox
                label="Text"
                mode="dark"
                selected={false}
              />
              <Checkbox
                label="Text"
                mode="dark"
                selected={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkboxes
