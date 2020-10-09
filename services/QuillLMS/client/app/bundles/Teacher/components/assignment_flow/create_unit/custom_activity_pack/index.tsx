import * as React from 'react';

import { Activity } from './interfaces'
import { calculateNumberOfPages } from './sharedFunctions'
import ActivityTableContainer from './activity_table_container'

import useDebounce from '../../../../hooks/useDebounce'
import { requestGet } from '../../../../../../modules/request/index'
import { Spinner, } from '../../../../../Shared/index'

interface AssignButtonProps {
  selectedActivities: Activity[],
  handleClickContinue: (event: any) => void
}

interface FilterColumnProps {
  activities: Activity[],
  filteredActivities: Activity[],
  calculateNumberOfFilters: () => number,
  resetAllFilters: () => void
}

interface CustomActivityPackProps {
  passedActivities?: Activity[],
  clickContinue: (event: any) => void,
  selectedActivities: Activity[],
  toggleActivitySelection: (activity: Activity) => void,
}

const AssignButton = ({ selectedActivities, handleClickContinue, }: AssignButtonProps) => {
  let buttonClass = 'quill-button contained primary medium focus-on-light';
  let action = handleClickContinue
  if (!(selectedActivities && selectedActivities.length)) {
    buttonClass += ' disabled';
    action = null
  }
  return <button className={buttonClass} onClick={action} type="button">Assign</button>
}

const FilterColumn = ({ activities, filteredActivities, calculateNumberOfFilters, resetAllFilters, }: FilterColumnProps) => {
  const numberOfFilters = calculateNumberOfFilters()
  const clearAllButton = numberOfFilters ? <button className="interactive-wrapper clear-filter" onClick={resetAllFilters} type="button">Clear all filters</button> : <span />
  const filterCount = numberOfFilters ? `${numberOfFilters} filter${numberOfFilters === 1 ? '' : 's'} • ` : ''
  return (<section className="filter-column">
    <section className="filter-section filtered-results">
      <div className="name-and-clear-all-wrapper">
        <h2>Filtered results</h2>
        {clearAllButton}
      </div>
      <p>{filterCount}{filteredActivities.length} of {activities.length}</p>
    </section>
    <section className="filter-section">
      <h2>Activities</h2>
    </section>
  </section>)
}

const CustomActivityPack = ({
  passedActivities,
  clickContinue,
  selectedActivities,
  toggleActivitySelection,
}: CustomActivityPackProps) => {
  const [activities, setActivities] = React.useState(passedActivities || [])
  const [filteredActivities, setFilteredActivities] = React.useState(activities)
  const [loading, setLoading] = React.useState(!passedActivities);
  // const [numberOfPages, setNumberOfPages] = React.useState(calculateNumberOfPages(activities));
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState('')
  const [lastFilter, setLastFilter] = React.useState(null)

  const debouncedSearch = useDebounce(search, 500);

  React.useEffect(() => {
    getActivities();
  }, []);

  React.useEffect(filterActivities, [debouncedSearch])

  function calculateNumberOfFilters() {
    let number = 0
    number += search.length ? 1 : 0
    return number
  }

  function getActivities() {
    requestGet('/activities/search',
      (data) => {
        setActivities(data.activities);
        setFilteredActivities(data.activities);
        // setNumberOfPages(calculateNumberOfPages(data.activities))
        setLoading(false)
      }
    )
  }

  function handleSearch(searchTerm) {
    setLastFilter({ function: setSearch, argument: '' })
    setSearch(searchTerm)
  }

  function resetAllFilters() {
    setLastFilter(null)
    setSearch('')
  }

  function filterActivities() {
    if (!activities.length) { return }

    const newFilteredActivities = activities.filter((a) => {
      const stringActivity = Object.values(a).join(' ').toLowerCase();
      return stringActivity.includes(search.toLowerCase());
    })
    const newNumberOfPages = calculateNumberOfPages(newFilteredActivities)
    if (currentPage > newNumberOfPages && currentPage !== 1) { setCurrentPage(newNumberOfPages) }
    setFilteredActivities(newFilteredActivities)
  }

  function undoLastFilter() {
    lastFilter.function(lastFilter.argument)
    setLastFilter(null)
  }

  if (loading) {
    return <div className="custom-activity-pack-page loading"><Spinner /></div>
  }

  return (<div className="custom-activity-pack-page">
    <FilterColumn
      activities={activities}
      calculateNumberOfFilters={calculateNumberOfFilters}
      filteredActivities={filteredActivities}
      resetAllFilters={resetAllFilters}
    />
    <section className="main-content-container">
      <header>
        <div className="header-content">
          <h1>Choose activities</h1>
          <AssignButton handleClickContinue={clickContinue} selectedActivities={selectedActivities} />
        </div>
      </header>
      <ActivityTableContainer
        currentPage={currentPage}
        filteredActivities={filteredActivities}
        handleSearch={handleSearch}
        resetAllFilters={resetAllFilters}
        search={search}
        selectedActivities={selectedActivities}
        setCurrentPage={setCurrentPage}
        toggleActivitySelection={toggleActivitySelection}
        undoLastFilter={undoLastFilter}
      />
    </section>
  </div>)
}

export default CustomActivityPack
