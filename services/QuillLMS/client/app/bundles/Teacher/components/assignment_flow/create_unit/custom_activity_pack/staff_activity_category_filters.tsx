import * as React from 'react';

import { Activity, ActivityCategory } from './interfaces'
import { ACTIVITY_CATEGORY_FILTERS, AVERAGE_FONT_WIDTH, } from './shared'
import { requestGet, requestPost, requestDelete } from '../../../../../../modules/request/index'

import { Tooltip } from '../../../../../Shared/index'

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

const activityCategoryTooltipText = "Each activity is assigned one activity category. Activity categories are the \"concept\" activity attribute used to filter and order activities and shown under the activity's title in the custom activity pack page. Changing the order of activity categories on this page changes the default order in which activities are displayed to teachers. Note that these concepts are not the same concepts that are displayed in a featured activity pack page, and they are not the same concepts used to build the Concepts data report."

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

  if (activityCount === 0) {
    checkbox = <div aria-label={`Check ${activityCategory.name}`} className="focus-on-light quill-checkbox disabled" />
  } else if (activityCategoryFilters.includes(activityCategory.id)) {
    checkbox = (<button aria-label={`Uncheck ${activityCategory.name}`} className="focus-on-light quill-checkbox selected" onClick={uncheckIndividualFilter} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  }

  const activityCategoryNameElement = activityCategory.name.length * AVERAGE_FONT_WIDTH >= 200 ? <Tooltip tooltipText={activityCategory.name} tooltipTriggerText={activityCategory.name} tooltipTriggerTextClass="tooltip-trigger-text" /> : <span>{activityCategory.name}</span>

  return (<div className="individual-row filter-row activity-category-row" key={activityCategory.id}>
    <div>
      {checkbox}
      {activityCategoryNameElement}
    </div>
    <span>({activityCount})</span>
  </div>)
}

const ActivityCategoryFilters = ({ activities, filterActivities, activityCategoryFilters, handleActivityCategoryFilterChange, }: ActivityCategoryFiltersProps) => {
  function clearAllActivityCategoryFilters() { handleActivityCategoryFilterChange([]) }

  function getActivities() {
    requestGet('/cms/activity_categories',
      (data) => {
        setActivityCategories(data.activity_categories);
      }
    )
  }

  const allActivityCategories = activities.map(a => a.activity_category)
  const uniqueActivityCategoryIds = Array.from(new Set(allActivityCategories.map(a => a.id)))
  const uniqueActivityCategories = uniqueActivityCategoryIds.map(id => allActivityCategories.find(ac => ac.id === id)).filter(ac => ac.name && ac.id)
  const sortedActivityCategories = uniqueActivityCategories.sort((ac1, ac2) => ac1.name.localeCompare(ac2.name))

  const filteredActivities = filterActivities(ACTIVITY_CATEGORY_FILTERS)

  const activityCategoryRows = sortedActivityCategories.map(ac =>
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

  return (<section className="filter-section activity-category-filter-section">
    <div className="name-and-clear-wrapper">
      <h2>Concepts (Activity Category)
      <Tooltip
        tooltipText={activityCategoryTooltipText}
        tooltipTriggerText={<i className="fal fa-info-circle" />}
      />
      </h2>
      {clearButton}
    </div>
    {activityCategoryRows}
  </section>)
}

export default ActivityCategoryFilters
