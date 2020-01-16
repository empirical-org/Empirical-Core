import React from 'react'
import { components } from 'react-select';

export const HTMLDropdownOption = props => {
  const { label, } = props
  return (
    <div className="html-dropdown-option">
      <components.Option {...props}>
        <div dangerouslySetInnerHTML={{ __html: label }} />
      </components.Option>
    </div>
  );
};
