import * as React from 'react';

import { Activity } from './interfaces'
import FilterColumn from './filter_column'

const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`

interface MobileFilterMenuProps {
  activities: Activity[],
  filteredActivities: Activity[],
  calculateNumberOfFilters: () => number,
  resetAllFilters: () => void,
  activityClassificationFilters: string[],
  handleActivityClassificationFilterChange: (activityClassificationFilters: string[]) => void,
  ccssGradeLevelFilters: number[],
  handleCCSSGradeLevelFilterChange: (ccssGradeLevelFilters: number[]) => void,
  activityCategoryFilters: number[],
  handleActivityCategoryFilterChange: (activityCategoryFilters: number[]) => void,
  filterActivities: (ignoredKey?: string) => Activity[],
  setShowMobileFilterMenu: (show: boolean) => void,
  showMobileFilterMenu: boolean,
  contentPartnerFilters: number[],
  handleContentPartnerFilterChange: (contentPartnerFilters: number[]) => void,
  readabilityGradeLevelFilters: number[],
  handleReadabilityGradeLevelFilterChange: (readabilityGradeLevelFilters: number[]) => void,
  topicFilters: number[],
  handleTopicFilterChange: (topicFilters: number[]) => void,
  savedActivityFilters: number[],
  handleSavedActivityFilterChange: () => void,
  savedActivityIds: number[]
}

const MobileFilterMenu = ({
  activities,
  activityCategoryFilters,
  activityClassificationFilters,
  calculateNumberOfFilters,
  contentPartnerFilters,
  handleContentPartnerFilterChange,
  filterActivities,
  filteredActivities,
  ccssGradeLevelFilters,
  readabilityGradeLevelFilters,
  handleActivityCategoryFilterChange,
  handleActivityClassificationFilterChange,
  handleCCSSGradeLevelFilterChange,
  handleReadabilityGradeLevelFilterChange,
  topicFilters,
  handleTopicFilterChange,
  resetAllFilters,
  showMobileFilterMenu,
  setShowMobileFilterMenu,
  savedActivityFilters,
  handleSavedActivityFilterChange,
  savedActivityIds
}: MobileFilterMenuProps) => {
  if (!showMobileFilterMenu) { return <span /> }

  function closeMobileFilterMenu() { setShowMobileFilterMenu(false) }
  return (<section className="mobile-filter-menu">
    <div className="top-section">
      <button className="interactive-wrapper focus-on-light" onClick={closeMobileFilterMenu} type="button">
        <img alt="Close icon" src={closeIconSrc} />
        Close
      </button>
    </div>
    <FilterColumn
      activities={activities}
      activityCategoryFilters={activityCategoryFilters}
      activityClassificationFilters={activityClassificationFilters}
      calculateNumberOfFilters={calculateNumberOfFilters}
      ccssGradeLevelFilters={ccssGradeLevelFilters}
      contentPartnerFilters={contentPartnerFilters}
      filterActivities={filterActivities}
      filteredActivities={filteredActivities}
      handleActivityCategoryFilterChange={handleActivityCategoryFilterChange}
      handleActivityClassificationFilterChange={handleActivityClassificationFilterChange}
      handleCCSSGradeLevelFilterChange={handleCCSSGradeLevelFilterChange}
      handleContentPartnerFilterChange={handleContentPartnerFilterChange}
      handleReadabilityGradeLevelFilterChange={handleReadabilityGradeLevelFilterChange}
      handleSavedActivityFilterChange={handleSavedActivityFilterChange}
      handleTopicFilterChange={handleTopicFilterChange}
      readabilityGradeLevelFilters={readabilityGradeLevelFilters}
      resetAllFilters={resetAllFilters}
      savedActivityFilters={savedActivityFilters}
      topicFilters={topicFilters}
    />
    <button className="quill-button primary contained medium focus-on-light" onClick={closeMobileFilterMenu} type="button">
      Apply
    </button>
  </section>)
}

export default MobileFilterMenu
