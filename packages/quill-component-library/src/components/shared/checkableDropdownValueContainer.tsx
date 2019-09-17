import React from 'react'
import { components } from 'react-select';

export const CheckableDropdownValueContainer = props => {
  const { optionType, value, options } = props.selectProps
  let text = `${value.length} ${optionType}${value.length === 1 ? '' : 's'}`
  if (value.length === options.length - 1) {
    text = `All ${optionType}s`
  }
  return (
    <div className="checkable-dropdown-value-container">
      <components.ValueContainer {...props}>
        {text}
      </components.ValueContainer>
    </div>
  );
};
