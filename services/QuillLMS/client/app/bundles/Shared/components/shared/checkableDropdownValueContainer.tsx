import * as React from 'react';
import { components } from 'react-select';

export const CheckableDropdownValueContainer = props => {
  const { selectProps, } = props
  const { optionType, optionTypeDescriptor, value, options, } = selectProps

  const optionTypeDescriptorOrEmptyString = optionTypeDescriptor || ''

  let text = `${value.length} ${optionType}${value.length === 1 ? '' : 's'} ${optionTypeDescriptorOrEmptyString}`
  if (value.length === options.length - 1) {
    text = `All ${optionType}s ${optionTypeDescriptorOrEmptyString}`
  }

  return (
    <div className="custom-dropdown-value-container">
      <components.ValueContainer {...props}>
        <div className="multi-option-summary-text">{text}</div>
      </components.ValueContainer>
    </div>
  );
};
