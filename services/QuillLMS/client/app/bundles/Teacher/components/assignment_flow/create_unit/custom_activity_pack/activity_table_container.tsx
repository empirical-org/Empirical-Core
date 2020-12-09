import * as React from 'react';

import { Activity } from './interfaces'
import { lowerBound, upperBound, sortFunctions, } from './shared'
import ActivityRow from './activity_row'
import Pagination from './pagination'
import SortDropdown from './sort_dropdown'

import { requestPost, } from '../../../../../../modules/request'

const quillLessonsTeacherSrc = `${process.env.CDN_URL}/images/illustrations/quill-lessons-teacher.svg`
const searchIconSrc = `${process.env.CDN_URL}/images/icons/search.svg`
const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`
const filterIconSrc = `${process.env.CDN_URL}/images/icons/icons-filter.svg`
const sortIconSrc = `${process.env.CDN_URL}/images/icons/icons-sort.svg`
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
  resetAllFilters: (event: any) => void,
  setShowMobileFilterMenu: (showMenu: boolean) => void,
  setShowMobileSortMenu: (showMenu: boolean) => void,
  sort: string,
  setSort: (sort: string) => void,
  saveActivity: (activityId: number) => void,
  unsaveActivity: (activityId: number) => void,
  savedActivityIds: number[],
  showLessonsBanner: boolean
}

const FilterAndSort = ({ setShowMobileFilterMenu, setShowMobileSortMenu, }) => {
  function openMobileFilterMenu() { setShowMobileFilterMenu(true) }
  function openMobileSortMenu() { setShowMobileSortMenu(true) }
  return (<section className="filter-and-sort">
    <button className="interactive-wrapper focus-on-light" onClick={openMobileFilterMenu} type="button">
      <img alt="Filter icon" src={filterIconSrc} />
      Filters
    </button>
    <span className="divider" />
    <button className="interactive-wrapper focus-on-light" onClick={openMobileSortMenu} type="button">
      <img alt="Sort icon" src={sortIconSrc} />
      Sort by
    </button>
  </section>)
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

const LessonsBanner = ({ lessonsBannerShowing, selectedActivities, closeLessonsBanner, }) => {
  if (!lessonsBannerShowing) { return <span /> }
  if (!selectedActivities.some(sa => sa.activity_classification.key === 'lessons')) { return <span /> }

  return (<section className="lessons-banner">
    <img alt="teacher at a board showing a projected Quill Lesson" src={quillLessonsTeacherSrc} />
    <div className="text">
      <h2>Heads up, you’ve selected a Quill Lessons activity (whole class instruction)</h2>
      <p>Quill Lessons requires the teacher to launch and lead an interactive lesson synchronously with their students. <a href="https://support.quill.org/en/articles/1173157-getting-started-how-to-set-up-your-first-quill-lesson">Learn more about how Quill Lessons works.</a></p>
    </div>
    <button className="quill-button outlined secondary medium" onClick={closeLessonsBanner} type="button">
      Got it
    </button>
  </section>)
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
  resetAllFilters,
  setShowMobileFilterMenu,
  setShowMobileSortMenu,
  sort,
  setSort,
  saveActivity,
  unsaveActivity,
  savedActivityIds,
  showLessonsBanner
}: ActivityTableContainerProps) => {
  const [lessonsBannerShowing, setLessonsBannerShowing] = React.useState(showLessonsBanner)
  const sortedActivities = sort ? sortFunctions[sort]([...filteredActivities]) : filteredActivities
  const currentPageActivities = sortedActivities.slice(lowerBound(currentPage), upperBound(currentPage));

  function closeLessonsBanner() {
    setLessonsBannerShowing(false)
    requestPost('/milestones/complete_acknowledge_lessons_banner')
  }


  const activityRows = currentPageActivities.map((act, i) => {
    const isSelected = selectedActivities.some(s => s.id === act.id)
    return (<ActivityRow
      activity={act}
      isFirst={i === 0}
      isSelected={isSelected}
      key={act.id}
      saveActivity={saveActivity}
      savedActivityIds={savedActivityIds}
      toggleActivitySelection={toggleActivitySelection}
      unsaveActivity={unsaveActivity}
    />)
  })

  const activityRowsOrEmptyState = activityRows.length ? activityRows : <EmptyState resetAllFilters={resetAllFilters} undoLastFilter={undoLastFilter} />

  return (<section className="activity-table-container">
    <LessonsBanner closeLessonsBanner={closeLessonsBanner} lessonsBannerShowing={lessonsBannerShowing} selectedActivities={selectedActivities} />
    <SearchAndSort handleSearch={handleSearch} search={search} setSort={setSort} sort={sort} />
    <FilterAndSort setShowMobileFilterMenu={setShowMobileFilterMenu} setShowMobileSortMenu={setShowMobileSortMenu} />
    {activityRowsOrEmptyState}
    <Pagination activities={filteredActivities} currentPage={currentPage} setCurrentPage={setCurrentPage} />
  </section>)
}

export default ActivityTableContainer
