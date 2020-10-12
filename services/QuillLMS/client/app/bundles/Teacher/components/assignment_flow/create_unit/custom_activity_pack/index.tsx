import * as React from 'react';

import { Activity } from './interfaces'
import { calculateNumberOfPages, activityClassificationGroupings } from './shared'
import ActivityTableContainer from './activity_table_container'
import FilterColumn from './filter_column'

import useDebounce from '../../../../hooks/useDebounce'
import { requestGet } from '../../../../../../modules/request/index'
import { Spinner, } from '../../../../../Shared/index'

interface AssignButtonProps {
  selectedActivities: Activity[],
  handleClickContinue: (event: any) => void
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

const CustomActivityPack = ({
  passedActivities,
  clickContinue,
  selectedActivities,
  toggleActivitySelection,
}: CustomActivityPackProps) => {
  const [activities, setActivities] = React.useState(passedActivities || [])
  const [filteredActivities, setFilteredActivities] = React.useState(activities)
  const [loading, setLoading] = React.useState(!passedActivities);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState('')
  const [filterHistory, setFilterHistory] = React.useState([])
  const [activityClassificationFilters, setActivityClassificationFilters] = React.useState([])

  const debouncedSearch = useDebounce(search, 500);
  const debouncedActivityClassificationFilters = useDebounce(activityClassificationFilters, 500);

  React.useEffect(() => {
    getActivities();
  }, []);

  React.useEffect(filterActivities, [debouncedSearch, debouncedActivityClassificationFilters])

  function calculateNumberOfFilters() {
    let number = 0
    number += search.length ? 1 : 0

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

  function resetAllFilters() {
    setFilterHistory([])
    setSearch('')
    setActivityClassificationFilters([])
  }

  function filterActivities() {
    if (!activities.length) { return }

    const newFilteredActivities = activities.filter((a) => {
      if (activityClassificationFilters.length && !activityClassificationFilters.includes(a.activity_classification.key)) {
        return false
      }
      const stringActivity = Object.values(a).join(' ').toLowerCase();
      return stringActivity.includes(search.toLowerCase());
    })
    const newNumberOfPages = calculateNumberOfPages(newFilteredActivities)
    if (currentPage > newNumberOfPages && currentPage !== 1) { setCurrentPage(newNumberOfPages) }
    setFilteredActivities(newFilteredActivities)
    window.scrollTo(0, 0)
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

  return (<div className="custom-activity-pack-page">
    <FilterColumn
      activities={activities}
      activityClassificationFilters={activityClassificationFilters}
      calculateNumberOfFilters={calculateNumberOfFilters}
      filteredActivities={filteredActivities}
      handleActivityClassificationFilterChange={handleActivityClassificationFilterChange}
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
