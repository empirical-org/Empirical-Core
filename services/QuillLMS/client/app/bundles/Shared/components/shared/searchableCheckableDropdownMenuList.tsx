import * as React from 'react';
import { components } from 'react-select';

const searchIconSrc = 'https://assets.quill.org/images/icons/dropdown-search.svg'

export const SearchableCheckableDropdownMenuList = ({ selectProps, ...props }) => {
  const { onInputChange, inputValue, onMenuInputFocus } = selectProps;

  // Copied from source
  const ariaAttributes = {
    "aria-autocomplete": "list",
    "aria-label": selectProps["aria-label"],
    "aria-labelledby": selectProps["aria-labelledby"]
  };

  return (
    <div className="searchable-checkable-dropdown-menu-list">
      <div className="input-wrapper">
        <img alt="" src={searchIconSrc} />
        <input
          {...ariaAttributes}
          autoComplete="off"
          autoCorrect="off"
          onChange={(e) => onInputChange(e.currentTarget.value, {
            action: "input-change"
          })}
          onFocus={onMenuInputFocus}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.target.focus();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            e.target.focus();
          }}
          placeholder="Search"
          spellCheck="false"
          type="search"
          value={inputValue}
        />
      </div>
      <components.MenuList {...props} selectProps={selectProps} />
    </div>
  );
};
