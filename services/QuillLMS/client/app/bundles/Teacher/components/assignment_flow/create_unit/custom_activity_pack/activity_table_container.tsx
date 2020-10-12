import * as React from 'react';

import { Activity } from './interfaces'
import { lowerBound, upperBound, } from './shared'
import ActivityRow from './activity_row'
import Pagination from './pagination'

const TAB = 'Tab'
const ARROWDOWN = 'ArrowDown'
const ARROWUP = 'ArrowUp'
const MOUSEDOWN = 'mousedown'
const KEYDOWN = 'keydown'
const DEFAULT = 'default'
const CCSS_ASCENDING = 'ccss-asc'
const CCSS_DESCENDING = 'ccss-desc'
const CONCEPT = 'concept'

const searchIconSrc = `${process.env.CDN_URL}/images/icons/search.svg`
const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`
const dropdownIconSrc = `${process.env.CDN_URL}/images/icons/dropdown.svg`
const emptySearchSrc = `${process.env.CDN_URL}/images/illustrations/search-empty.svg`

interface ActivityTableContainerProps {
  filteredActivities: Activity[],
  selectedActivities: Activity[],
  toggleActivitySelection: (activity: Activity) => void,
  currentPage: number,
  setCurrentPage: (currentPage: number) => void,
  search: string,
  handleSearch: (event: any) => void,
  undoLastFilter: (event: any) => void,
  resetAllFilters: (event: any) => void
}

const getNumberFromString = (string) => {
  const numberMatch = string.match(/\d+/g)
  if (numberMatch) { return Number(numberMatch[0]) }

  return null
}

const conceptSort = (activities) => activities.sort((a, b) => {
  if (!a.activity_category_name) { return 1 }
  if (!b.activity_category_name) { return -1 }
  return a.activity_category_name.localeCompare(b.activity_category_name)
})

const ccssAscendingSort = (activities) => activities.sort((a, b) => {
  const numberMatchA = getNumberFromString(a.standard_level_name)
  const numberMatchB = getNumberFromString(b.standard_level_name)

  if (!numberMatchA) { return 1 }
  if (!numberMatchB) { return -1 }

  return numberMatchA - numberMatchB
})

const ccssDescendingSort = (activities) => activities.sort((a, b) => {
  const numberMatchA = getNumberFromString(a.standard_level_name)
  const numberMatchB = getNumberFromString(b.standard_level_name)

  if (!numberMatchA) { return 1 }
  if (!numberMatchB) { return -1 }

  return numberMatchB - numberMatchA
})

const sortFunctions = {
  [DEFAULT]: (activities) => activities,
  [CCSS_ASCENDING]: ccssAscendingSort,
  [CCSS_DESCENDING]: ccssDescendingSort,
  [CONCEPT]: conceptSort
}

const sortOptions = [
  {
    label: 'Default',
    key: DEFAULT,
    value: DEFAULT
  },
  {
    label: 'CCSS Grade Level (Low to High)',
    key: CCSS_ASCENDING,
    value: CCSS_ASCENDING
  },
  {
    label: 'CCSS Grade Level (High to Low)',
    key: CCSS_DESCENDING,
    value: CCSS_DESCENDING
  },
  {
    label: 'Concept',
    key: CONCEPT,
    value: CONCEPT
  }
]

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

  return (<div className="sort-wrapper" ref={dropdownContainer}>
    <button className="sort-dropdown-label interactive-wrapper focus-on-light" onClick={toggleDropdownIsOpen} type="button">Sort by: <span>{selectedOption ? selectedOption.label : 'Default'}</span> {sortIcon}</button>
    <SortDropdownOptions dropdownIsOpen={dropdownIsOpen} setDropdownIsOpen={setDropdownIsOpen} setSort={setSort} />
  </div>)
}

const SearchAndSort = ({ handleSearch, search, setSort, sort, }) => {
  function handleClickClear() { handleSearch('') }
  function handleInputChange(e) { handleSearch(e.target.value) }

  const clearButton = !!search.length && <button className="interactive-wrapper close-icon focus-on-light" onClick={handleClickClear} type="button"><img alt="Clear icon" src={closeIconSrc} /></button>
  return (<section className="search-and-sort">
    <div className="search-wrapper">
      <img alt="Magnifying glass" className="search-icon" src={searchIconSrc} />
      <input
        aria-label="Search field"
        onChange={handleInputChange}
        placeholder="Search for concepts, activities, and more"
        value={search}
      />
      {clearButton}
    </div>
    <SortDropdown setSort={setSort} sort={sort} />
  </section>)
}

const EmptyState = ({ undoLastFilter, resetAllFilters, }) => {
  return (<div className="empty-state">
    <img alt="Illustration of a magnifying glass over an empty document" src={emptySearchSrc} />
    <h3>No results</h3>
    <p>Undo your last filter to see activities. Or clear all filters.</p>
    <div className="empty-state-button-wrapper">
      <button className="focus-on-light quill-button medium outlined secondary" onClick={resetAllFilters} type="button">Clear all filters</button>
      <button className="focus-on-light quill-button medium contained primary" onClick={undoLastFilter} type="button">Undo</button>
    </div>
  </div>)
}

const ActivityTableContainer = ({
  filteredActivities,
  selectedActivities,
  toggleActivitySelection,
  currentPage,
  setCurrentPage,
  search,
  handleSearch,
  undoLastFilter,
  resetAllFilters
}: ActivityTableContainerProps) => {
  const [sort, setSort] = React.useState(DEFAULT)

  const sortedActivities = sort ? sortFunctions[sort]([...filteredActivities]) : filteredActivities
  const currentPageActivities = sortedActivities.slice(lowerBound(currentPage), upperBound(currentPage));

  const activityRows = currentPageActivities.map(act => {
    const isSelected = selectedActivities.some(s => s.id === act.id)
    return <ActivityRow activity={act} isSelected={isSelected} key={act.id} toggleActivitySelection={toggleActivitySelection} />
  })

  const activityRowsOrEmptyState = activityRows.length ? activityRows : <EmptyState resetAllFilters={resetAllFilters} undoLastFilter={undoLastFilter} />

  return (<section className="activity-table-container">
    <SearchAndSort handleSearch={handleSearch} search={search} setSort={setSort} sort={sort} />
    {activityRowsOrEmptyState}
    <Pagination activities={filteredActivities} currentPage={currentPage} setCurrentPage={setCurrentPage} />
  </section>)
}

export default ActivityTableContainer
