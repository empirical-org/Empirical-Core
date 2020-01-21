import React from 'react'
import { components } from 'react-select';

const handleMouseEnter = (props) => {
  const { options, selectProps, data, } = props
  const index = options.findIndex(opt => opt.value === data.value)
  return () => {selectProps.updateCursor(index)}
}

export const HTMLDropdownOption = props => {
  const { label, selectProps, options, data, } = props
  const passedProps = {...props}
  passedProps.isFocused = options[selectProps.cursor] === data
  return (
    <div className="html-dropdown-option" onMouseOver={handleMouseEnter(props)}>
      <components.Option {...props}>
        <div dangerouslySetInnerHTML={{ __html: label }} />
      </components.Option>
    </div>
  );
};
