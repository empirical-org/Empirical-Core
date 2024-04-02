import * as React from 'react';
import { components } from 'react-select';

export const HTMLDropdownSingleValue = props => {
  const { data, } = props
  return (
    <div className="html-dropdown-option">
      <components.SingleValue {...props}>
        <div dangerouslySetInnerHTML={{ __html: data.label }} />
      </components.SingleValue>
    </div>
  );
};
