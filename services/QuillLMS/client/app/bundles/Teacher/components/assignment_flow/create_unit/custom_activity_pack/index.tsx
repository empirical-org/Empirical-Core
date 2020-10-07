import * as React from 'react';

import { Activity } from './interfaces'
import ActivityRow from './activity_row'

import { requestGet } from '../../../../../../modules/request/index'

const expandSrc = `${process.env.CDN_URL}/images/shared/expand.svg`

const RESULTS_PER_PAGE = 20

const lowerBound = (currentPage: number): number => (currentPage - 1) * RESULTS_PER_PAGE;
const upperBound = (currentPage: number): number => currentPage * RESULTS_PER_PAGE;

interface AssignButtonProps {
  selectedActivities: Activity[],
  handleClickContinue: (event: any) => void
}

interface PaginationProps {
  activities: Activity[],
  currentPage: number,
  setCurrentPage: (currentPage: number) => void
}

interface ActivityTableContainerProps {
  filteredActivities: Activity[],
  selectedActivities: Activity[],
  toggleActivitySelection: (activity: Activity) => void,
  currentPage: number,
  setCurrentPage: (currentPage: number) => void
}

interface FilterColumnProps {
  activities: Activity[],
  filteredActivities: Activity[]
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

const Pagination = ({ activities, currentPage, setCurrentPage, }: PaginationProps) => {
  const numberOfPages = Math.ceil(activities.length / RESULTS_PER_PAGE)
  if (numberOfPages < 2) { return <span /> }

  function handleLeftArrowClick() { setCurrentPage(currentPage - 1) }
  function handleRightArrowClick() { setCurrentPage(currentPage + 1) }

  const leftArrow = currentPage > 1 ? <button className="pagination-button left-arrow" onClick={handleLeftArrowClick} type="button"><img alt="Arrow pointing left" src={expandSrc} /></button> : null
  const rightArrow = currentPage < numberOfPages ? <button className="pagination-button right-arrow" onClick={handleRightArrowClick} type="button"><img alt="Arrow pointing right" src={expandSrc} /></button> : null

  const paginationRow = (<div className="pagination-row">
    {leftArrow}
    {rightArrow}
  </div>)

  const lowestDisplayedNumber = lowerBound(currentPage) + 1
  const highestDisplayedNumber = upperBound(currentPage) > activities.length ? activities.length : upperBound(currentPage)

  return (<section className="pagination-section">
    {paginationRow}
    <p>{lowestDisplayedNumber}-{highestDisplayedNumber} of {activities.length}</p>
  </section>)
}

const ActivityTableContainer = ({
  filteredActivities,
  selectedActivities,
  toggleActivitySelection,
  currentPage,
  setCurrentPage,
}: ActivityTableContainerProps) => {
  const [sort, setSort] = React.useState(null)

  const sortedActivities = filteredActivities
  const currentPageActivities = sortedActivities.slice(lowerBound(currentPage), upperBound(currentPage));

  const activityRows = currentPageActivities.map(act => {
    const isSelected = selectedActivities.some(s => s.id === act.id)
    return <ActivityRow activity={act} isSelected={isSelected} key={act.id} toggleActivitySelection={toggleActivitySelection} />
  })

  return (<section className="activity-table-container">
    {activityRows}
    <Pagination activities={filteredActivities} currentPage={currentPage} setCurrentPage={setCurrentPage} />
  </section>)
}

const FilterColumn = ({ activities, filteredActivities, }: FilterColumnProps) => {
  return (<section className="filter-column">
    <section className="filter-section filtered-results">
      <h2>Filtered results</h2>
      <p>{filteredActivities.length} of {activities.length}</p>
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

  React.useEffect(() => {
    getActivities();
  }, []);

  const getActivities = () => {
    requestGet('/activities/search',
      (data) => {
        setActivities(data.activities);
        setFilteredActivities(data.activities);
        // setNumberOfPages(calculateNumberOfPages(data.activities))
        setLoading(false)
      }
    )
  }


  return (<div className="custom-activity-pack-page">
    <FilterColumn activities={activities} filteredActivities={filteredActivities} />
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
        selectedActivities={selectedActivities}
        setCurrentPage={setCurrentPage}
        toggleActivitySelection={toggleActivitySelection}
      />
    </section>
  </div>)
}

export default CustomActivityPack
