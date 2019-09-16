import React from 'react'
import { components } from 'react-select';

const indeterminateSrc = 'https://assets.quill.org/images/icons/indeterminate.svg'
const smallWhiteCheckSrc = 'https://assets.quill.org/images/shared/check-small-white.svg'

export const CheckableDropdownOption = props => {
  const { value } = props.selectProps
  const anyOptionsAreSelected = !!value.length
  let checkbox = <span className="quill-checkbox unselected"/>
  if (props.value === 'All' && anyOptionsAreSelected) {
    checkbox = <span className="quill-checkbox selected">
      <img src={indeterminateSrc} alt="check"/>
    </span>
  } else if (props.isSelected && props.value !== 'All') {
    checkbox = <span className="quill-checkbox selected">
      <img src={smallWhiteCheckSrc} alt="check" />
    </span>
  }

  return (
    <div className="checkable-dropdown-option">
      <components.Option {...props}>
        {checkbox}
        <span>{props.label}</span>
      </components.Option>
    </div>
  );
};
