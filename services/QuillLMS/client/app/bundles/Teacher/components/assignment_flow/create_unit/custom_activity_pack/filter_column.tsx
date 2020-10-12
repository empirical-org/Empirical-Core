import * as React from 'react';

import { Activity } from './interfaces'
import ActivityClassificationFilters from './activity_classification_filters'

interface FilterColumnProps {
  activities: Activity[],
  filteredActivities: Activity[],
  calculateNumberOfFilters: () => number,
  resetAllFilters: () => void,
  activityClassificationFilters: string[],
  handleActivityClassificationFilterChange: (activityClassificationFilters: string[]) => void,
  filterActivities: (ignoredKey?: string) => Activity[]
}

const FilterColumn = ({ activities, filteredActivities, filterActivities, calculateNumberOfFilters, resetAllFilters, activityClassificationFilters, handleActivityClassificationFilterChange, }: FilterColumnProps) => {
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
    <ActivityClassificationFilters
      activities={activities}
      activityClassificationFilters={activityClassificationFilters}
      filterActivities={filterActivities}
      handleActivityClassificationFilterChange={handleActivityClassificationFilterChange}
    />
  </section>)
}

export default FilterColumn
