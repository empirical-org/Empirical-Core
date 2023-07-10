import * as React from 'react'

import { DropdownInput, Option, } from './dropdownInput'

import { unorderedArraysAreEqual, } from '../../../../modules/unorderedArraysAreEqual'

const removeSearchTokenSrc = `${process.env.CDN_URL}/images/pages/administrator/remove_search_token.svg`

interface DropdownInputWithSearchTokensProps {
  id: string;
  label: string;
  optionType: string;
  options: Option[];
  value: Option[];
  valueToDisplay: Option[];
  onChange: (selections: Option[]) => void;
  identifier: string;
}

interface SearchTokenProps {
  searchItem: Option;
  onRemoveSearchItem: (searchItem: Option) => void
}

const SearchToken = ({ searchItem, onRemoveSearchItem, }: SearchTokenProps) => {
  function handleRemoveSearchItem() { onRemoveSearchItem(searchItem)}

  return (
    <div className="search-token">
      <span>{searchItem.label}</span>
      <button aria-label={`Remove ${searchItem.label} from filtered list`} className="interactive-wrapper focus-on-light" onClick={handleRemoveSearchItem} type="button"><img alt="" src={removeSearchTokenSrc} /></button>
    </div>
  )
}

const DropdownInputWithSearchTokens = ({ id, label, optionType, options, value, valueToDisplay, onChange, identifier, }: DropdownInputWithSearchTokensProps) => {
  function handleRemoveSearchItem(item) {
    const newItems = value.filter(v => v[identifier] !== item[identifier])

    if (newItems.length) {
      onChange(newItems)
    } else {
      onChange(options)
    }
  }

  const searchTokens = !unorderedArraysAreEqual(valueToDisplay, options) && valueToDisplay.map(o => (
    <SearchToken
      key={o[identifier]}
      onRemoveSearchItem={handleRemoveSearchItem}
      searchItem={o}
    />
  ))

  return (
    <div className="dropdown-input-with-search-tokens-container">
      <label className="dropdown-input-label" htmlFor={id}>{label}</label>
      <DropdownInput
        handleChange={onChange}
        id={id}
        isMulti={true}
        isSearchable={true}
        label=""
        options={options}
        optionType={optionType}
        value={valueToDisplay}
      />
      <div className="search-tokens">{searchTokens}</div>
    </div>
  )
}

export { DropdownInputWithSearchTokens, }
