import * as React from "react";
import _ from 'lodash';
import { DISABLED, HOVER } from "../../../Shared";

const DEFAULT = 'default'
const BUTTON = 'Button'
const SIZES = [{ label: 'Extra Small (XS)', value: 'extra-small' }, { label: 'Small', value: 'small' }, { label: 'Medium', value: 'medium' }, { label: 'Large', value: 'large' }, { label: 'Extra Large (XL)', value: 'extra-large' }, ]
const STATES = [DEFAULT, HOVER, DISABLED]
const COLORS = ['green', 'gold', 'maroon', 'blue', 'teal', 'viridian', 'purple', 'violet', 'red', 'grey']
const WHITE_STAR_ICON_SRC = 'https://assets.quill.org/images/icons/xs/star-white.svg'
const GREEN_STAR_ICON_SRC = 'https://assets.quill.org/images/icons/xs/star-green.svg'

const Buttons = () => {
  return (
    <div id="buttons">
      <h2 className="style-guide-h2">Buttons (New)</h2>
      <div className="variations-container">
        <h4 className="style-guide-h4">Sizes</h4>
        <div className="options-container">
          {SIZES.map(({ label, value }) => {
            return (
              <div className="option-container">
                <p className="option-label">{label}</p>
                <div className="quill-button-container">
                  <button className={`quill-button focus-on-light ${value} contained`}>{BUTTON}</button>
                </div>
                <p className="option-label">{`quill-button ${value} contained`}</p>
              </div>
            )
          })}
        </div>
        <h4 className="style-guide-h4">States</h4>
        <div className="options-container">
          {STATES.map(state => {
            let style = ''
            if (state === HOVER) { style = 'hover' }
            if (state === DISABLED) { style = 'disabled' }
            return (
              <div className="option-container">
                <p className="option-label">{_.capitalize(state)}</p>
                <div className="quill-button-container states">
                  <button className={`quill-button focus-on-light small contained ${style}`} disabled={state === DISABLED}>{BUTTON}</button>
                  <button className={`quill-button focus-on-light small outlined ${style}`} disabled={state === DISABLED}>{BUTTON}</button>
                  <button className={`quill-button focus-on-light small outlined grey ${style}`} disabled={state === DISABLED}>{BUTTON}</button>
                </div>
                {state === DISABLED && <p className="option-label">{`quill-button small contained ${style}`}</p>}
              </div>
            )
          })}
        </div>
        <h4 className="style-guide-h4">Icon</h4>
        <div className="options-container">
          <div className="option-container">
            <p className="option-label">With Icon</p>
            <div className="quill-button-container states">
              <button className="quill-button focus-on-light small contained icon">
                <img alt="" src={WHITE_STAR_ICON_SRC} />
                {BUTTON}
              </button>
              <button className="quill-button focus-on-light small outlined icon">
                <img alt="" src={GREEN_STAR_ICON_SRC} />
                {BUTTON}
              </button>
            </div>
            <p className="option-label">quill-button small contained icon</p>
          </div>
          <div className="option-container">
            <p className="option-label">Without Icon</p>
            <div className="quill-button-container states">
              <button className="quill-button focus-on-light small contained">{BUTTON}</button>
              <button className="quill-button focus-on-light small outlined">{BUTTON}</button>
            </div>
          </div>
        </div>
        <h4 className="style-guide-h4">Variants</h4>
        <div className="options-container">
          <div className="option-container">
            <p className="option-label">Contained</p>
            <div className="quill-button-container variants">
              {COLORS.map(color => (
                <button className={`quill-button focus-on-light small contained ${color}`}>{BUTTON}</button>
              ))}
            </div>
            <p className="option-label">{'quill-button small contained {color}'}</p>
          </div>
          <div className="option-container">
            <p className="option-label">Outlined</p>
            <div className="quill-button-container variants">
              {COLORS.map(color => (
                <button className={`quill-button focus-on-light small outlined ${color}`}>{BUTTON}</button>
              ))}
            </div>
            <p className="option-label">{'quill-button small outlined {color}'}</p>
          </div>
        </div>
        <h4 className="style-guide-h4">Colors</h4>
        <div className="options-container">
          {COLORS.map((color, i) => {
            const label = i === 0 ? 'Default (Green)' : _.capitalize(color)
            return (
              <div className="option-container">
                <p className="option-label">{label}</p>
                <div className="quill-button-container colors">
                  <button className={`quill-button focus-on-light small contained ${color}`}>{BUTTON}</button>
                  <button className={`quill-button focus-on-light small contained hover ${color}`}>{BUTTON}</button>
                </div>
                <p className="option-label">{`quill-button small contained ${color}`}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Buttons
