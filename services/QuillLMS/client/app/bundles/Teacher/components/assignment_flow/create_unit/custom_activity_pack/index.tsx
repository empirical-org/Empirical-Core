import * as React from 'react';

import { Activity } from './interfaces'
import { calculateNumberOfPages } from './sharedFunctions'
import ActivityTableContainer from './activity_table_container'

import useDebounce from '../../../../hooks/useDebounce'
import { requestGet } from '../../../../../../modules/request/index'
import { Spinner, } from '../../../../../Shared/index'

const dropdownIconSrc = `${process.env.CDN_URL}/images/icons/dropdown.svg`
const indeterminateSrc = `${process.env.CDN_URL}/images/icons/indeterminate.svg`
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

const activityClassificationGroupings = [
  {
    group: 'Independent Practice',
    keys: ['connect', 'sentence', 'passage']
  },
  {
    group: 'Whole Class Instruction',
    keys: ['lessons']
  },
  {
    group: 'Diagnostics',
    keys: ['diagnostic']
  }
]

interface AssignButtonProps {
  selectedActivities: Activity[],
  handleClickContinue: (event: any) => void
}

interface FilterColumnProps {
  activities: Activity[],
  filteredActivities: Activity[],
  calculateNumberOfFilters: () => number,
  resetAllFilters: () => void,
  activityClassificationFilters: string[],
  handleActivityClassificationFilterChange: (activityClassificationFilters: string[]) => void
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

const ActivityClassificationToggle = ({filteredActivities, grouping, uniqueActivityClassifications, activityClassificationFilters, handleActivityClassificationFilterChange, }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  function toggleIsOpen() { setIsOpen(!isOpen) }

  function uncheckAllFilters() {
    const newActivityClassificationFilters = activityClassificationFilters.filter(key => !grouping.keys.includes(key))
    handleActivityClassificationFilterChange(newActivityClassificationFilters)
  }

  function checkAllFilters() {
    const newActivityClassificationFilters = Array.from(new Set(activityClassificationFilters.concat(grouping.keys)))
    handleActivityClassificationFilterChange(newActivityClassificationFilters)
  }

  const toggleArrow = <button aria-label="Toggle menu" className="interactive-wrapper focus-on-light toggle-button" onClick={toggleIsOpen} type="button"><img alt="" className={isOpen ? 'is-open' : 'is-closed'} src={dropdownIconSrc} /></button>
  let topLevelCheckbox = <button aria-label="Check all nested filters" className="quill-checkbox unselected" onClick={checkAllFilters} type="button" />

  const topLevelActivityCount = filteredActivities.filter(act => grouping.keys.includes(act.activity_classification.key)).length

  if (grouping.keys.every(key => activityClassificationFilters.includes(key))) {
    topLevelCheckbox = (<button aria-label="Uncheck all nested filters" className="quill-checkbox selected" onClick={uncheckAllFilters} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  } else if (grouping.keys.some(key => activityClassificationFilters.includes(key))) {
    topLevelCheckbox = (<button aria-label="Uncheck all nested filters" className="quill-checkbox selected" onClick={uncheckAllFilters} type="button">
      <img alt="Indeterminate checkbox" src={indeterminateSrc} />
    </button>)
  }

  let individualFilters = <span />
  if (isOpen) {
    individualFilters = grouping.keys.map(key => {

      function checkIndividualFilter() {
        const newActivityClassificationFilters = Array.from(new Set(activityClassificationFilters.concat([key])))
        handleActivityClassificationFilterChange(newActivityClassificationFilters)
      }

      function uncheckIndividualFilter() {
        const newActivityClassificationFilters = activityClassificationFilters.filter(k => k !== key)
        handleActivityClassificationFilterChange(newActivityClassificationFilters)
      }

      const activityClassification = uniqueActivityClassifications.find(ac => ac.key === key)
      const activityCount = filteredActivities.filter(act => key === act.activity_classification.key).length
      let checkbox = <button aria-label={`Check ${activityClassification.alias}`} className="quill-checkbox unselected" onClick={checkIndividualFilter} type="button" />

      if (activityClassificationFilters.includes(key)) {
        checkbox = (<button aria-label={`Uncheck ${activityClassification.alias}`} className="quill-checkbox selected" onClick={uncheckIndividualFilter} type="button">
          <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
        </button>)
      }

      return (<div className="individual-row filter-row" key={key}>
        <div>
          {checkbox}
          <div className="alias-and-description">
            <span>{activityClassification.alias}</span>
            <span className="description">{activityClassification.description}</span>
          </div>
        </div>
        <span>({activityCount})</span>
      </div>)
    })
  }

  return (<section className="toggle-section activity-classification-toggle">
    <div className="top-level filter-row">
      <div>
        {toggleArrow}
        {topLevelCheckbox}
        <span>{grouping.group}</span>
      </div>
      <span>({topLevelActivityCount})</span>
    </div>
    {individualFilters}
  </section>)
}

const ActivityClassificationFilters = ({ activities, filteredActivities, activityClassificationFilters, handleActivityClassificationFilterChange, }) => {
  const allActivityClassifications = activities.map(a => a.activity_classification)
  const uniqueActivityClassificationIds = Array.from(new Set(allActivityClassifications.map(a => a.id)))
  const uniqueActivityClassifications = uniqueActivityClassificationIds.map(id => allActivityClassifications.find(ac => ac.id === id))

  function clearAllActivityClassificationFilters() { handleActivityClassificationFilterChange([]) }

  const activityClassificationToggles = activityClassificationGroupings.map(grouping =>
    (<ActivityClassificationToggle
      activityClassificationFilters={activityClassificationFilters}
      filteredActivities={filteredActivities}
      grouping={grouping}
      handleActivityClassificationFilterChange={handleActivityClassificationFilterChange}
      key={grouping.group}
      uniqueActivityClassifications={uniqueActivityClassifications}
    />)
  )
  const clearButton = activityClassificationFilters.length ? <button className="interactive-wrapper clear-filter" onClick={clearAllActivityClassificationFilters} type="button">Clear</button> : <span />
  return (<section className="filter-section">
    <div className="name-and-clear-wrapper">
      <h2>Activities</h2>
      {clearButton}
    </div>
    {activityClassificationToggles}
  </section>)
}

const FilterColumn = ({ activities, filteredActivities, calculateNumberOfFilters, resetAllFilters, activityClassificationFilters, handleActivityClassificationFilterChange, }: FilterColumnProps) => {
  const numberOfFilters = calculateNumberOfFilters()
  const clearAllButton = numberOfFilters ? <button className="interactive-wrapper clear-filter" onClick={resetAllFilters} type="button">Clear all filters</button> : <span />
  const filterCount = numberOfFilters ? `${numberOfFilters} filter${numberOfFilters === 1 ? '' : 's'} • ` : ''
  return (<section className="filter-column">
    <section className="filter-section filtered-results">
      <div className="name-and-clear-wrapper">
        <h2>Filtered results</h2>
        {clearAllButton}
      </div>
      <p>{filterCount}{filteredActivities.length} of {activities.length}</p>
    </section>
    <ActivityClassificationFilters activities={activities} activityClassificationFilters={activityClassificationFilters} filteredActivities={filteredActivities} handleActivityClassificationFilterChange={handleActivityClassificationFilterChange} />
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
