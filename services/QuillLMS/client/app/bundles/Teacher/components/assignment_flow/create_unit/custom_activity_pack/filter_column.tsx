import * as React from 'react';

import { Activity, ActivityCategoryEditor } from './interfaces'
import ActivityClassificationFilters from './activity_classification_filters'
import ActivityCategoryFilters from './activity_category_filters'
import StaffActivityCategoryFilters from './staff_activity_category_filters'
import CCSSGradeLevelFilters from './ccss_grade_level_filters'
import ELLFilters from './ell_filters'
import ReadabilityGradeLevelFilters from './readability_grade_level_filters'
import ContentPartnerFilters from './content_partner_filters'
import TopicFilters from './topic_filters'
import FlagFilters from './flag_filters'

interface FilterColumnProps {
  activities: Activity[],
  filteredActivities: Activity[],
  calculateNumberOfFilters: () => number,
  resetAllFilters: () => void,
  activityClassificationFilters: string[],
  handleActivityClassificationFilterChange: (activityClassificationFilters: string[]) => void,
  ccssGradeLevelFilters: number[],
  ellFilters: number[],
  handleCCSSGradeLevelFilterChange: (ccssGradeLevelFilters: number[]) => void,
  handleELLFilterChange: (ellFilters: number[]) => void,
  activityCategoryFilters: number[],
  handleActivityCategoryFilterChange: (activityCategoryFilters: number[]) => void,
  filterActivities: (ignoredKey?: string) => Activity[],
  contentPartnerFilters: number[],
  handleContentPartnerFilterChange: (contentPartnerFilters: number[]) => void,
  readabilityGradeLevelFilters: number[],
  handleReadabilityGradeLevelFilterChange: (readabilityGradeLevelFilters: number[]) => void,
  topicFilters: number[],
  handleTopicFilterChange: (topicFilters: number[]) => void,
  savedActivityFilters: number[],
  handleSavedActivityFilterChange: () => void,
  savedActivityIds: number[],
  flagFilters: string[],
  handleFlagFilterChange: () => void,
  showComprehension: boolean,
  isStaff?: boolean,
  activityCategoryEditor?: ActivityCategoryEditor
}

const FilterColumn = ({
  activities,
  filteredActivities,
  filterActivities,
  calculateNumberOfFilters,
  resetAllFilters,
  activityClassificationFilters,
  handleActivityClassificationFilterChange,
  handleCCSSGradeLevelFilterChange,
  ccssGradeLevelFilters,
  ellFilters,
  handleELLFilterChange,
  handleActivityCategoryFilterChange,
  activityCategoryFilters,
  contentPartnerFilters,
  handleContentPartnerFilterChange,
  readabilityGradeLevelFilters,
  handleReadabilityGradeLevelFilterChange,
  topicFilters,
  handleTopicFilterChange,
  savedActivityFilters,
  handleSavedActivityFilterChange,
  savedActivityIds,
  isStaff,
  showComprehension,
  flagFilters,
  handleFlagFilterChange,
  activityCategoryEditor
}: FilterColumnProps) => {
  const numberOfFilters = calculateNumberOfFilters()
  const clearAllButton = numberOfFilters ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={resetAllFilters} type="button">Clear all filters</button> : <span />
  const filterCount = numberOfFilters ? `${numberOfFilters} filter${numberOfFilters === 1 ? '' : 's'} • ` : ''

  let flagFilterSection
  let activityCategoryFilterSection = (<ActivityCategoryFilters
    activities={activities}
    activityCategoryFilters={activityCategoryFilters}
    filterActivities={filterActivities}
    handleActivityCategoryFilterChange={handleActivityCategoryFilterChange}
  />)

  if (isStaff) {
    flagFilterSection = (<FlagFilters
      activities={activities}
      filterActivities={filterActivities}
      flagFilters={flagFilters}
      handleFlagFilterChange={handleFlagFilterChange}
    />)
    activityCategoryFilterSection = (<StaffActivityCategoryFilters
      activityCategoryEditor={activityCategoryEditor}
      filterActivities={filterActivities}
    />)
  }

  return (
    <div className="filter-column-wrapper">
      <section className="filter-column">
        <section className="filter-section filtered-results">
          <div className="name-and-clear-wrapper">
            <h2>Filtered Results</h2>
            {clearAllButton}
          </div>
          <p>{filterCount}{filteredActivities.length} of {activities.length} activities</p>
        </section>
        {flagFilterSection}
        <ActivityClassificationFilters
          activities={activities}
          activityClassificationFilters={activityClassificationFilters}
          filterActivities={filterActivities}
          handleActivityClassificationFilterChange={handleActivityClassificationFilterChange}
          handleSavedActivityFilterChange={handleSavedActivityFilterChange}
          savedActivityFilters={savedActivityFilters}
          savedActivityIds={savedActivityIds}
          showComprehension={showComprehension}
        />
        <ReadabilityGradeLevelFilters
          handleReadabilityGradeLevelFilterChange={handleReadabilityGradeLevelFilterChange}
          readabilityGradeLevelFilters={readabilityGradeLevelFilters}
        />
        <CCSSGradeLevelFilters
          ccssGradeLevelFilters={ccssGradeLevelFilters}
          handleCCSSGradeLevelFilterChange={handleCCSSGradeLevelFilterChange}
        />
        <ELLFilters
          activities={activities}
          ellFilters={ellFilters}
          filterActivities={filterActivities}
          handleELLFilterChange={handleELLFilterChange}
        />
        {activityCategoryFilterSection}
        <TopicFilters
          activities={activities}
          filterActivities={filterActivities}
          handleTopicFilterChange={handleTopicFilterChange}
          topicFilters={topicFilters}
        />
        <ContentPartnerFilters
          activities={activities}
          contentPartnerFilters={contentPartnerFilters}
          filterActivities={filterActivities}
          handleContentPartnerFilterChange={handleContentPartnerFilterChange}
        />
      </section>
    </div>
  )
}

export default FilterColumn
