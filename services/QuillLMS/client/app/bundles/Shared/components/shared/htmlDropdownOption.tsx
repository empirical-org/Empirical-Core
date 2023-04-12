import * as React from 'react';
import { components } from 'react-select';

const handleMouseEnter = (props) => {
  const { options, selectProps, data, } = props
  const index = options.findIndex(opt => opt.value === data.value)
  return () => {selectProps.updateCursor(index)}
}

export const HTMLDropdownOption = props => {
  const { label, data, } = props
  const passedProps = {...props}
  passedProps.innerProps.id = data.value
  return (
    <div className="html-dropdown-option" onFocus={handleMouseEnter(props)} onMouseOver={handleMouseEnter(props)}>
      <components.Option {...passedProps}>
        <div dangerouslySetInnerHTML={{ __html: label }} />
      </components.Option>
    </div>
  );
};
