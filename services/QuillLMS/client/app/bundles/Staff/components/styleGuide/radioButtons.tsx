import * as React from 'react';
import _ from 'lodash';
import { ACTIVE, RadioButton, DISABLED, INACTIVE } from '../../../Shared';

const STATES = [INACTIVE, ACTIVE, DISABLED]

const RadioButtons= () => {
  return (
    <div id="radio-buttons">
      <h2 className="style-guide-h2">Radio Buttons</h2>
      <div className="states-and-modes-container">
        <h4 className="style-guide-h4">States</h4>
        <div className="options-container">
          {STATES.map(state => {
            return (
              <div className="option-container">
                <p className="option-label">{_.capitalize(state)}</p>
                <div className="radio-buttons">
                  <RadioButton
                    label="Text"
                    selected={false}
                    state={state}
                  />
                  <RadioButton
                    label="Text"
                    selected={state === ACTIVE}
                    state={state}
                  />
                  <RadioButton
                    label="Text"
                    selected={false}
                    state={state}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <h4 className="style-guide-h4">Modes</h4>
        <div className="options-container">
          <div className="option-container">
            <p className="option-label">On Light</p>
            <div className="radio-buttons">
              <RadioButton
                label="Text"
                selected={false}
              />
              <RadioButton
                label="Text"
                selected={true}
              />
            </div>
          </div>
          <div className="option-container dark">
            <p className="option-label">On Dark</p>
            <div className="radio-buttons">
              <RadioButton
                label="Text"
                mode="dark"
                selected={false}
              />
              <RadioButton
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

export default RadioButtons
