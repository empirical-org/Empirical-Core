import * as React from 'react';

import { Activity, ActivityCategory } from './interfaces';
import { ACTIVITY_CATEGORY_FILTERS, AVERAGE_FONT_WIDTH } from './shared';

import { Tooltip } from '../../../../../Shared/index';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface ActivityCategoryFilterRowProps {
  activityCategoryFilters: number[],
  activityCategory: ActivityCategory,
  handleActivityCategoryFilterChange: (activityCategoryFilters: number[]) => void,
  uniqueActivityCategories: ActivityCategory[],
  filteredActivities: Activity[]
}

interface ActivityCategoryFiltersProps {
  activities: Activity[],
  filterActivities: (ignoredKey?: string) => Activity[]
  activityCategoryFilters: number[],
  handleActivityCategoryFilterChange: (activityCategoryFilters: number[]) => void,
}

const ActivityCategoryFilterRow = ({ activityCategoryFilters, activityCategory, handleActivityCategoryFilterChange, filteredActivities, }: ActivityCategoryFilterRowProps) => {
  function checkIndividualFilter() {
    const newActivityCategoryFilters = Array.from(new Set(activityCategoryFilters.concat([activityCategory.id])))
    handleActivityCategoryFilterChange(newActivityCategoryFilters)
  }

  function uncheckIndividualFilter() {
    const newActivityCategoryFilters = activityCategoryFilters.filter(k => k !== activityCategory.id)
    handleActivityCategoryFilterChange(newActivityCategoryFilters)
  }

  const activityCount = filteredActivities.filter(act => activityCategory.id === act.activity_category.id).length
  let checkbox = <button aria-label={`Check ${activityCategory.name}`} className="focus-on-light quill-checkbox unselected" onClick={checkIndividualFilter} type="button" />

  if (activityCategoryFilters.includes(activityCategory.id)) {
    checkbox = (<button aria-label={`Uncheck ${activityCategory.name}`} className="focus-on-light quill-checkbox selected" onClick={uncheckIndividualFilter} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  } else if (activityCount === 0) {
    checkbox = <div aria-label={`Check ${activityCategory.name}`} className="focus-on-light quill-checkbox disabled" />
  }

  const activityCategoryNameElement = activityCategory.name.length * AVERAGE_FONT_WIDTH >= 200 ? <Tooltip tooltipText={activityCategory.name} tooltipTriggerText={activityCategory.name} tooltipTriggerTextClass="tooltip-trigger-text" /> : <span>{activityCategory.name}</span>

  return (
    <div className="individual-row filter-row activity-category-row" key={activityCategory.id}>
      <div>
        {checkbox}
        {activityCategoryNameElement}
      </div>
      <span>({activityCount})</span>
    </div>
  )
}

const ActivityCategoryFilters = ({ activities, filterActivities, activityCategoryFilters, handleActivityCategoryFilterChange, }: ActivityCategoryFiltersProps) => {
  const [showAll, setShowAll] = React.useState(false)

  function clearAllActivityCategoryFilters() { handleActivityCategoryFilterChange([]) }
  function toggleShowAll() { setShowAll(!showAll) }

  const allActivityCategories = activities.map(a => a.activity_category)
  const uniqueActivityCategoryIds = Array.from(new Set(allActivityCategories.map(a => a.id)))
  const uniqueActivityCategories = uniqueActivityCategoryIds.map(id => allActivityCategories.find(ac => ac.id === id)).filter(ac => ac.name && ac.id)
  const sortedActivityCategories = uniqueActivityCategories.sort((ac1, ac2) => ac1.name.localeCompare(ac2.name))
  const displayedActivityCategories = showAll ? sortedActivityCategories : sortedActivityCategories.slice(0, 5)

  const filteredActivities = filterActivities(ACTIVITY_CATEGORY_FILTERS)

  const activityCategoryRows = displayedActivityCategories.map(ac =>
    (<ActivityCategoryFilterRow
      activityCategory={ac}
      activityCategoryFilters={activityCategoryFilters}
      filteredActivities={filteredActivities}
      handleActivityCategoryFilterChange={handleActivityCategoryFilterChange}
      key={ac.id}
      uniqueActivityCategories={uniqueActivityCategories}
    />)
  )

  const clearButton = activityCategoryFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllActivityCategoryFilters} type="button">Clear</button> : <span />

  return (
    <section className="filter-section activity-category-filter-section">
      <div className="name-and-clear-wrapper">
        <h2>Concepts</h2>
        {clearButton}
      </div>
      {activityCategoryRows}
      <button className="interactive-wrapper focus-on-light toggle-show-all-button" onClick={toggleShowAll} type="button">{showAll ? 'View fewer' : `View all ${uniqueActivityCategories.length} concepts`}</button>
    </section>
  )
}

export default ActivityCategoryFilters
