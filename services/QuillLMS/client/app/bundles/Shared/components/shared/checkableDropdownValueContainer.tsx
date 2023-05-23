import * as React from 'react';
import { components } from 'react-select';

const COMBOBOX = "combobox" // role identifier for react-select's input element

export const CheckableDropdownValueContainer = props => {
  const { selectProps, children, } = props
  const { optionType, value, options, inputValue, isSearchable, } = selectProps

  let text = `${value.length} ${optionType}${value.length === 1 ? '' : 's'}`
  if (value.length === options.length - 1) {
    text = `All ${optionType}s`
  }

  const inputElement = children.filter(element => Boolean(element)).find(({ props }) => props?.role === COMBOBOX)

  return (
    <div className="custom-dropdown-value-container">
      <components.ValueContainer {...props}>
        {isSearchable && inputElement}
        {!inputValue.length && <div className="multi-option-summary-text">{text}</div>}
      </components.ValueContainer>
    </div>
  );
};
