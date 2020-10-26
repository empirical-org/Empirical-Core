import * as React from 'react';

import { Activity } from './interfaces'
import ActivityClassificationFilters from './activity_classification_filters'
import ActivityCategoryFilters from './activity_category_filters'
import GradeLevelFilters from './grade_level_filters'
import ContentPartnerFilters from './content_partner_filters'

interface FilterColumnProps {
  activities: Activity[],
  filteredActivities: Activity[],
  calculateNumberOfFilters: () => number,
  resetAllFilters: () => void,
  activityClassificationFilters: string[],
  handleActivityClassificationFilterChange: (activityClassificationFilters: string[]) => void,
  gradeLevelFilters: number[],
  handleGradeLevelFilterChange: (gradeLevelFilters: number[]) => void,
  activityCategoryFilters: number[],
  handleActivityCategoryFilterChange: (activityCategoryFilters: number[]) => void,
  filterActivities: (ignoredKey?: string) => Activity[],
  contentPartnerFilters: number[],
  handleContentPartnerFilterChange: (contentPartnerFilters: number[]) => void,
}

const FilterColumn = ({
  activities,
  filteredActivities,
  filterActivities,
  calculateNumberOfFilters,
  resetAllFilters,
  activityClassificationFilters,
  handleActivityClassificationFilterChange,
  handleGradeLevelFilterChange,
  gradeLevelFilters,
  handleActivityCategoryFilterChange,
  activityCategoryFilters,
  contentPartnerFilters,
  handleContentPartnerFilterChange
}: FilterColumnProps) => {
  const numberOfFilters = calculateNumberOfFilters()
  const clearAllButton = numberOfFilters ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={resetAllFilters} type="button">Clear all filters</button> : <span />
  const filterCount = numberOfFilters ? `${numberOfFilters} filter${numberOfFilters === 1 ? '' : 's'} • ` : ''
  return (<section className="filter-column">
    <section className="filter-section filtered-results">
      <div className="name-and-clear-wrapper">
        <h2>Filtered Results</h2>
        {clearAllButton}
      </div>
      <p>{filterCount}{filteredActivities.length} of {activities.length} activities</p>
    </section>
    <ActivityClassificationFilters
      activities={activities}
      activityClassificationFilters={activityClassificationFilters}
      filterActivities={filterActivities}
      handleActivityClassificationFilterChange={handleActivityClassificationFilterChange}
    />
    <GradeLevelFilters
      gradeLevelFilters={gradeLevelFilters}
      handleGradeLevelFilterChange={handleGradeLevelFilterChange}
    />
    <ActivityCategoryFilters
      activities={activities}
      activityCategoryFilters={activityCategoryFilters}
      filterActivities={filterActivities}
      handleActivityCategoryFilterChange={handleActivityCategoryFilterChange}
    />
    <ContentPartnerFilters
      activities={activities}
      contentPartnerFilters={contentPartnerFilters}
      filterActivities={filterActivities}
      handleContentPartnerFilterChange={handleContentPartnerFilterChange}
    />
  </section>)
}

export default FilterColumn
