import * as React from 'react';

import { Activity } from './interfaces'
import { calculateNumberOfPages, activityClassificationGroupings, filters, DEFAULT } from './shared'
import ActivityTableContainer from './activity_table_container'
import FilterColumn from './filter_column'
import Header from './header'
import MobileFilterMenu from './mobile_filter_menu'
import MobileSortMenu from './mobile_sort_menu'

import useDebounce from '../../../../hooks/useDebounce'
import { requestGet } from '../../../../../../modules/request/index'
import { Spinner, } from '../../../../../Shared/index'

const DEBOUNCE_LENGTH = 500

interface CustomActivityPackProps {
  passedActivities?: Activity[],
  clickContinue: (event: any) => void,
  selectedActivities: Activity[],
  setSelectedActivities: (selectedActivities: Activity[]) => void,
  toggleActivitySelection: (activity: Activity) => void,
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

  function handleSearch(newSearchTerm: string) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setSearch, argument: search }]))
    setSearch(newSearchTerm)
  }

  function handleActivityClassificationFilterChange(newActivityClassificationFilters: string[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setActivityClassificationFilters, argument: activityClassificationFilters }]))
    setActivityClassificationFilters(newActivityClassificationFilters)
  }

  function handleGradeLevelFilterChange(newGradeLevelFilters: number[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setGradeLevelFilters, argument: gradeLevelFilters }]))
    setGradeLevelFilters(newGradeLevelFilters)
  }

  function handleActivityCategoryFilterChange(newActivityCategoryFilters: number[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setActivityCategoryFilters, argument: activityCategoryFilters }]))
    setActivityCategoryFilters(newActivityCategoryFilters)
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
    scrollContainer && scrollContainer.scrollTo(0, 0)
  }

  function undoLastFilter() {
    const lastIndex = filterHistory.length - 1
    const lastItem = filterHistory[lastIndex]
    lastItem.function(lastItem.argument)
    const newFilterHistory = filterHistory.splice(0, lastIndex)
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
