import * as React from 'react';
import { SortableHandle, } from 'react-sortable-hoc';

import { Activity } from './interfaces'
import { calculateNumberOfPages, activityClassificationGroupings, filters, ACTIVITY_CLASSIFICATION_FILTERS } from './shared'
import ActivityTableContainer from './activity_table_container'
import ActivityRow from './activity_row'
import FilterColumn from './filter_column'

import SortableList from '../../../shared/sortableList'
import useDebounce from '../../../../hooks/useDebounce'
import { requestGet } from '../../../../../../modules/request/index'
import { Spinner, } from '../../../../../Shared/index'

const DEBOUNCE_LENGTH = 500

const reorderSrc = `${process.env.CDN_URL}/images/icons/reorder.svg`

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

const Header = ({ handleClickContinue, selectedActivities, setSelectedActivities, }) => {
  const [showActivities, setShowActivities] = React.useState(false)

  function toggleShowActivities() { setShowActivities(!showActivities)}


  function sortCallback(sortInfo) {
    const newOrder = sortInfo.map(item => item.key);
    const newOrderedActivities = newOrder.map((key, i) => selectedActivities.find(a => a.id === Number(key)))
    setSelectedActivities(newOrderedActivities)
  }

  let headerContent = <h1>Choose activities</h1>
  let className = ''
  if (selectedActivities.length) {
    className = 'has-selected-activities'
    const text = selectedActivities.length > 1 ? `${selectedActivities.length} activities selected` : '1 activity selected'
    headerContent = (<div>
      <h1>{text}</h1>
      <button className="focus-on-light quill-button medium secondary outlined" onClick={toggleShowActivities} type="button">{showActivities ? 'Hide' : 'View'}</button>
    </div>)
  }

  let selectedActivitySection

  if (showActivities) {
    const selectedActivityRows = selectedActivities.map((a, i) => {
      const className = `selected-activity-row ${i === selectedActivities.length - 1 && 'is-last'}`
      const DragHandle = SortableHandle(() => <img alt="Reorder icon" className="reorder-icon focus-on-light" src={reorderSrc} tabIndex={0} />);
      return (<section className={className} key={a.id}>
        <DragHandle />
        <ActivityRow activity={a} isSelected={true} showCheckbox={false} showRemoveButton={true} />
      </section>)
    })
    selectedActivitySection = <SortableList data={selectedActivityRows} helperClass="sortable-selected-activity-row" sortCallback={sortCallback} useDragHandle={true} />
  }

  return (<header className={className}>
    <div className="header-content">
      {headerContent}
      <AssignButton handleClickContinue={handleClickContinue} selectedActivities={selectedActivities} />
    </div>
    {selectedActivitySection}
  </header>)
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

  return (<div className="custom-activity-pack-page">
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
    <section className="main-content-container">
      <Header handleClickContinue={clickContinue} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
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
