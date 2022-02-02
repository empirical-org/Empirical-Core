import * as React from 'react';

import { sortOptions, } from './shared'

const TAB = 'Tab'
const ARROWDOWN = 'ArrowDown'
const ARROWUP = 'ArrowUp'
const MOUSEDOWN = 'mousedown'
const KEYDOWN = 'keydown'

const dropdownIconSrc = `${process.env.CDN_URL}/images/icons/dropdown.svg`

const SortDropdownOptions = ({ dropdownIsOpen, setDropdownIsOpen, setSort, }) => {
  if (!dropdownIsOpen) { return <span /> }

  function handleClickSortOption(e) {
    setSort(e.target.value)
    setDropdownIsOpen(false)
  }

  const options = sortOptions.map(opt => <button id={opt.key} key={opt.key} onClick={handleClickSortOption} tabIndex={-1} type="button" value={opt.value}>{opt.label}</button>)

  return <div className="sort-dropdown">{options}</div>
}


const SortDropdown = ({ setSort, sort, }) => {
  const [dropdownIsOpen, setDropdownIsOpen] = React.useState(false)
  const [cursor, setCursor] = React.useState(null)

  React.useEffect(() => setCursor(null), [dropdownIsOpen])

  const dropdownContainer = React.useRef(null)

  function toggleDropdownIsOpen() {
    setDropdownIsOpen(!dropdownIsOpen)
  }

  function handleClickOutsideDropdown(e) {
    if (dropdownContainer && !dropdownContainer.current.contains(e.target)) {
      setDropdownIsOpen(false)
    }
  }

  const handleKeyDown = React.useCallback((e) => {
    const inactiveNode = !(dropdownContainer && dropdownContainer.current.contains(e.target))
    const keyWasNotTab = e.key !== TAB

    if (inactiveNode && keyWasNotTab) { return }

    switch (e.key) {
      case ARROWDOWN:
        e.preventDefault()
        if (cursor < sortOptions.length - 1) {
          setCursor(prevCursor => prevCursor !== null ? prevCursor + 1 : 0)
        } else if (cursor === null && sortOptions.length === 1) {
          setCursor(0)
        } else {
          updateFocusedOption()
        }
        break
      case ARROWUP:
        e.preventDefault()
        setCursor(prevCursor => Math.max(prevCursor - 1, 0))
        break
      case TAB:
        setDropdownIsOpen(false)
        break
      default:
        break
    }
  }, [cursor])

  React.useEffect(() => {
    document.addEventListener(MOUSEDOWN, handleClickOutsideDropdown, false)
    document.addEventListener(KEYDOWN, handleKeyDown, false)
    return () => {
      document.removeEventListener(MOUSEDOWN, handleClickOutsideDropdown, false);
      document.removeEventListener(KEYDOWN, handleKeyDown, false);
    };
  }, [handleKeyDown])

  React.useEffect(updateFocusedOption, [cursor])

  function updateFocusedOption() {
    if (cursor === null) { return }
    const focusedOption = sortOptions[cursor]

    const element = document.getElementById(focusedOption.key)
    element.focus()
  }

  const sortIcon = <img alt="" className={`dropdown-icon ${dropdownIsOpen && 'is-open'}`} src={dropdownIconSrc} />

  const selectedOption = sortOptions.find(s => s.value === sort)

  return (
    <div className="sort-wrapper" ref={dropdownContainer}>
      <button className="sort-dropdown-label interactive-wrapper focus-on-light" onClick={toggleDropdownIsOpen} type="button">Sort by: <span>{selectedOption ? selectedOption.label : 'Default'}</span> {sortIcon}</button>
      <SortDropdownOptions dropdownIsOpen={dropdownIsOpen} setDropdownIsOpen={setDropdownIsOpen} setSort={setSort} />
    </div>
  )
}


export default SortDropdown
