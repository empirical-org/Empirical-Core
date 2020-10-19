import * as React from 'react';

import { Activity } from './interfaces'
import { calculateNumberOfPages, activityClassificationGroupings, filters, DEFAULT, sortOptions } from './shared'
import ActivityTableContainer from './activity_table_container'
import FilterColumn from './filter_column'
import Header from './header'

import useDebounce from '../../../../hooks/useDebounce'
import { requestGet } from '../../../../../../modules/request/index'
import { Spinner, } from '../../../../../Shared/index'

const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`

const DEBOUNCE_LENGTH = 500

interface CustomActivityPackProps {
  passedActivities?: Activity[],
  clickContinue: (event: any) => void,
  selectedActivities: Activity[],
  setSelectedActivities: (selectedActivities: Activity[]) => void,
  toggleActivitySelection: (activity: Activity) => void,
}

const MobileSortMenu = ({
  showMobileSortMenu,
  setShowMobileSortMenu,
  setSort
}) => {
  if (!showMobileSortMenu) { return <span /> }
  function closeMobileSortMenu() { setShowMobileSortMenu(false) }

  function handleClickSortOption(e) {
    setSort(e.target.value)
    closeMobileSortMenu()
  }

  const options = sortOptions.map(opt => <button id={opt.key} key={opt.key} onClick={handleClickSortOption} type="button" value={opt.value}>{opt.label}</button>)

  return (<section className="mobile-sort-menu">
    <div className="top-section">
      <button className="interactive-wrapper focus-on-light" onClick={closeMobileSortMenu} type="button">
        <img alt="Close icon" src={closeIconSrc} />
        Close
      </button>
    </div>
    <div className="sort-options">
      <h2>Sort by</h2>
      {options}
    </div>
  </section>)
}

const MobileFilterMenu = ({
  activities,
  activityCategoryFilters,
  activityClassificationFilters,
  calculateNumberOfFilters,
  filterActivities,
  filteredActivities,
  gradeLevelFilters,
  handleActivityCategoryFilterChange,
  handleActivityClassificationFilterChange,
  handleGradeLevelFilterChange,
  resetAllFilters,
  showMobileFilterMenu,
  setShowMobileFilterMenu
}) => {
  if (!showMobileFilterMenu) { return <span /> }

  function closeMobileFilterMenu() { setShowMobileFilterMenu(false) }
  return (<section className="mobile-filter-menu">
    <div className="top-section">
      <button className="interactive-wrapper focus-on-light" onClick={closeMobileFilterMenu} type="button">
        <img alt="Close icon" src={closeIconSrc} />
        Close
      </button>
    </div>
    <FilterColumn
      activities={activities}
      activityCategoryFilters={activityCategoryFilters}
      activityClassificationFilters={activityClassificationFilters}
      calculateNumberOfFilters={calculateNumberOfFilters}
      filterActivities={filterActivities}
      filteredActivities={filteredActivities}
      gradeLevelFilters={gradeLevelFilters}
      handleActivityCategoryFilterChange={handleActivityCategoryFilterChange}
      handleActivityClassificationFilterChange={handleActivityClassificationFilterChange}
      handleGradeLevelFilterChange={handleGradeLevelFilterChange}
      resetAllFilters={resetAllFilters}
    />
    <button className="quill-button primary contained medium focus-on-light" onClick={closeMobileFilterMenu} type="button">
      Apply
    </button>
  </section>)
}

const CustomActivityPack = ({
  passedActivities,
  clickContinue,
  selectedActivities,
  setSelectedActivities,
  toggleActivitySelection,
}: CustomActivityPackProps) => {
  const [activities, setActivities] = React.useState(passedActivities || [])
  const [filteredActivities, setFilteredActivities] = React.useState(activities)
  const [loading, setLoading] = React.useState(!passedActivities);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState('')
  const [filterHistory, setFilterHistory] = React.useState([])
  const [activityClassificationFilters, setActivityClassificationFilters] = React.useState([])
  const [gradeLevelFilters, setGradeLevelFilters] = React.useState([])
  const [activityCategoryFilters, setActivityCategoryFilters] = React.useState([])
  const [showMobileFilterMenu, setShowMobileFilterMenu] = React.useState(false)
  const [showMobileSortMenu, setShowMobileSortMenu] = React.useState(false)
  const [sort, setSort] = React.useState(DEFAULT)

  const debouncedSearch = useDebounce(search, DEBOUNCE_LENGTH);
  const debouncedActivityClassificationFilters = useDebounce(activityClassificationFilters, DEBOUNCE_LENGTH);
  const debouncedGradeLevelFilters = useDebounce(gradeLevelFilters, DEBOUNCE_LENGTH);
  const debouncedActivityCategoryFilters = useDebounce(activityCategoryFilters, DEBOUNCE_LENGTH);

  React.useEffect(() => {
    getActivities();
  }, []);

  React.useEffect(updateFilteredActivities, [debouncedSearch, debouncedActivityClassificationFilters, debouncedGradeLevelFilters, debouncedActivityCategoryFilters])

  function calculateNumberOfFilters() {
    let number = 0
    number += search.length ? 1 : 0
    number += gradeLevelFilters.length ? 1 : 0
    number += activityCategoryFilters.length

    activityClassificationGroupings.forEach((g) => {
      if (g.keys.every(key => activityClassificationFilters.includes(key))) {
        number += 1
      } else {
        number += g.keys.filter(key => activityClassificationFilters.includes(key)).length
      }
    })

    return number
  }

  function getActivities() {
    requestGet('/activities/search',
      (data) => {
        setActivities(data.activities);
        setFilteredActivities(data.activities);
        setLoading(false)
      }
    )
  }

  function handleSearch(searchTerm: string) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setSearch, argument: searchTerm }]))
    setSearch(searchTerm)
  }

  function handleActivityClassificationFilterChange(activityClassificationFilters: string[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setActivityClassificationFilters, argument: activityClassificationFilters }]))
    setActivityClassificationFilters(activityClassificationFilters)
  }

  function handleGradeLevelFilterChange(gradeLevelFilters: number[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setGradeLevelFilters, argument: gradeLevelFilters }]))
    setGradeLevelFilters(gradeLevelFilters)
  }

  function handleActivityCategoryFilterChange(activityCategoryFilters: number[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setActivityCategoryFilters, argument: activityCategoryFilters }]))
    setActivityCategoryFilters(activityCategoryFilters)
  }

  function resetAllFilters() {
    setFilterHistory([])
    setSearch('')
    setActivityClassificationFilters([])
    setGradeLevelFilters([])
    setActivityCategoryFilters([])
  }

  function filterActivities(ignoredKey=null) {
    return activities.filter(activity => Object.keys(filters).every(k => {
      if (k === ignoredKey) { return true }
      return filters[k](eval(k), activity)
    }))
  }

  function updateFilteredActivities() {
    if (!activities.length) { return }

    const newFilteredActivities = filterActivities()
    const newNumberOfPages = calculateNumberOfPages(newFilteredActivities)
    if (currentPage > newNumberOfPages && currentPage !== 1) { setCurrentPage(newNumberOfPages) }
    setFilteredActivities(newFilteredActivities)
    const scrollContainer = document.getElementsByClassName('main-content-container')[0]
    scrollContainer.scrollTo(0, 0)
  }

  function undoLastFilter() {
    const secondToLastIndex = filterHistory.length - 2
    const lastItem = filterHistory[secondToLastIndex]
    lastItem.function(lastItem.argument)
    const newFilterHistory = filterHistory.splice(0, secondToLastIndex)
    setFilterHistory(newFilterHistory)
  }


  if (loading) {
    return <div className="custom-activity-pack-page loading"><Spinner /></div>
  }

  const filterColumnProps = {
    activities,
    activityCategoryFilters,
    activityClassificationFilters,
    calculateNumberOfFilters,
    filterActivities,
    filteredActivities,
    gradeLevelFilters,
    handleActivityCategoryFilterChange,
    handleActivityClassificationFilterChange,
    handleGradeLevelFilterChange,
    resetAllFilters,
  }

  return (<div className="custom-activity-pack-page">
    <MobileFilterMenu {...filterColumnProps} setShowMobileFilterMenu={setShowMobileFilterMenu} showMobileFilterMenu={showMobileFilterMenu} />
    <MobileSortMenu setShowMobileSortMenu={setShowMobileSortMenu} setSort={setSort} showMobileSortMenu={showMobileSortMenu} />
    <FilterColumn {...filterColumnProps} />
    <section className="main-content-container">
      <Header handleClickContinue={clickContinue} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} toggleActivitySelection={toggleActivitySelection} />
      <ActivityTableContainer
        currentPage={currentPage}
        filteredActivities={filteredActivities}
        handleSearch={handleSearch}
        resetAllFilters={resetAllFilters}
        search={search}
        selectedActivities={selectedActivities}
        setCurrentPage={setCurrentPage}
        setShowMobileFilterMenu={setShowMobileFilterMenu}
        setShowMobileSortMenu={setShowMobileSortMenu}
        setSort={setSort}
        sort={sort}
        toggleActivitySelection={toggleActivitySelection}
        undoLastFilter={undoLastFilter}
      />
    </section>
  </div>)
}

export default CustomActivityPack
