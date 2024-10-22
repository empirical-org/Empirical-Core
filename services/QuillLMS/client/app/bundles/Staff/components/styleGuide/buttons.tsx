import * as React from "react";
import _ from 'lodash';
import { DropdownInput } from "../../../Shared";

const WHITE_STAR_ICON_SRC = 'https://assets.quill.org/images/icons/xs/star-white.svg'
const GREEN_STAR_ICON_SRC = 'https://assets.quill.org/images/icons/xs/star-green.svg'

const BUTTON = 'Button'
const SIZE = 'size'
const COLOR = 'color'
const VARIANT = 'variant'
const ICON = 'icon'
const DISABLED = 'disabled'

const sizeOptions = [
  { label: 'Extra Small (XS)', value: 'extra-small' },
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Extra Large (XL)', value: 'extra-large' }
]

const colorOptions = [
  { label: 'Green', value: 'green'},
  { label: 'Gold', value: 'gold'},
  { label: 'Maroon', value: 'maroon'},
  { label: 'Blue', value: 'blue'},
  { label: 'Teal', value: 'teal'},
  { label: 'Viridian', value: 'viridian'},
  { label: 'Purple', value: 'purple'},
  { label: 'Violet', value: 'violet'},
  { label: 'Red', value: 'red'},
  { label: 'Grey', value: 'grey'}
]

const variantOptions = [
  { label: 'Contained', value: 'contained' },
  { label: 'Outlined', value: 'outlined' },
  { label: 'Borderless', value: 'borderless' }
]

const iconOptions = [
  { value: '', label: 'Without icon' },
  { value: 'icon', label: 'With icon' }
]


const disabledOptions = [
  { value: '', label: 'False' },
  { value: 'disabled', label: 'True' }
]

const Buttons = () => {
  const [size, setSize] = React.useState<any>(sizeOptions[0]);
  const [color, setColor] = React.useState<any>(colorOptions[0]);
  const [variant, setVariant] = React.useState<any>(variantOptions[0]);
  const [hasIcon, setHasIcon] = React.useState<any>(iconOptions);
  const [isDisabled, setIsDisabled] = React.useState<any>(disabledOptions);

  const setterFunctions = {
    [SIZE]: setSize,
    [COLOR]: setColor,
    [VARIANT]: setVariant,
    [ICON]: setHasIcon,
    [DISABLED]: setIsDisabled,
  }

  function changeSavedValues(key, option) {
    const setterFunction = setterFunctions[key]
    setterFunction(option)
  }

  const iconStyle = hasIcon.value ? 'icon' : ''
  const disabledStyle = isDisabled.value ? 'disabled' : ''
  const buttonStyle = `quill-button ${size.value} ${color.value} ${variant.value} ${iconStyle} ${disabledStyle}`.trim().replace(/\s+/g, ' ')

  return (
    <div id="buttons">
      <h2 className="style-guide-h2">Buttons (New)</h2>
      <div className="element-row first">
        <div className="upper-container">
          <pre>
            {`
<button className="${buttonStyle}">Button</button>`}
          </pre>
          <div className="customization-options-container">
            <div className="left-side-container">
              <DropdownInput
                handleChange={(e) => { changeSavedValues(SIZE, e) }}
                isSearchable={true}
                label="Size"
                options={sizeOptions}
                value={size}
              />
              <DropdownInput
                handleChange={(e) => { changeSavedValues(COLOR, e) }}
                isSearchable={true}
                label="Color"
                options={colorOptions}
                value={color}
              />
            </div>
            <div className="right-side-container">
              <DropdownInput
                handleChange={(e) => { changeSavedValues(VARIANT, e) }}
                isSearchable={true}
                label="Variant"
                options={variantOptions}
                value={variant}
              />
              <DropdownInput
                handleChange={(e) => { changeSavedValues(DISABLED, e) }}
                isSearchable={true}
                label="Disabled"
                options={disabledOptions}
                value={isDisabled}
              />
            </div>
          </div>
        </div>
        <div className="customizable-button-container">
          <button className={buttonStyle}>{BUTTON}</button>
        </div>
      </div>
      <div className="variations-container">
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
        </div>
      </div>
    </div>
  )
}

export default Buttons
