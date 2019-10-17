import React from 'react'
import { components } from 'react-select';

const indeterminateSrc = 'https://assets.quill.org/images/icons/indeterminate.svg'
const smallWhiteCheckSrc = 'https://assets.quill.org/images/shared/check-small-white.svg'

const renderCheckbox = (props) => {
  const { value, options } = props.selectProps
  const anyOptionsAreSelected = !!value.length
  const allOptionsAreSelected = value.length === (options.length - 1)
  let checkbox = <span className="quill-checkbox unselected"/>
  if (props.isSelected || allOptionsAreSelected) {
    checkbox = (<span className="quill-checkbox selected">
      <img alt="check" src={smallWhiteCheckSrc} />
    </span>)
  } else if (props.value === 'All' && anyOptionsAreSelected) {
    checkbox = (<span className="quill-checkbox selected">
      <img alt="check" src={indeterminateSrc}/>
    </span>)
  }
  return checkbox
}

export const CheckableDropdownOption = props => {
  return (
    <div className="checkable-dropdown-option">
      <components.Option {...props}>
        {renderCheckbox(props)}
        <span>{props.label}</span>
      </components.Option>
    </div>
  );
};
