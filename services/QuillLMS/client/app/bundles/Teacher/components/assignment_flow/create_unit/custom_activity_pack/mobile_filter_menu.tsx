import * as React from 'react';

import { Activity, ActivityCategoryEditor } from './interfaces'
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
  savedActivityIds: number[],
  flagFilters: string[],
  handleFlagFilterChange: () => void,
  showComprehension?: boolean,
  isStaff?: boolean,
  activityCategoryEditor?: ActivityCategoryEditor
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
  savedActivityIds,
  isStaff,
  showComprehension,
  flagFilters,
  handleFlagFilterChange,
  activityCategoryEditor
}: MobileFilterMenuProps) => {
  if (!showMobileFilterMenu) { return <span /> }

  function closeMobileFilterMenu() { setShowMobileFilterMenu(false) }

  const filterColumnProps = {
    activities,
    activityCategoryFilters,
    activityClassificationFilters,
    calculateNumberOfFilters,
    contentPartnerFilters,
    filterActivities,
    filteredActivities,
    ccssGradeLevelFilters,
    handleActivityCategoryFilterChange,
    handleActivityClassificationFilterChange,
    handleContentPartnerFilterChange,
    handleCCSSGradeLevelFilterChange,
    resetAllFilters,
    readabilityGradeLevelFilters,
    handleReadabilityGradeLevelFilterChange,
    topicFilters,
    handleTopicFilterChange,
    savedActivityFilters,
    handleSavedActivityFilterChange,
    savedActivityIds,
    handleFlagFilterChange,
    flagFilters,
    isStaff,
    showComprehension,
    activityCategoryEditor
  }

  return (
    <section className="mobile-filter-menu">
      <div className="top-section">
        <button className="interactive-wrapper focus-on-light" onClick={closeMobileFilterMenu} type="button">
          <img alt="Close icon" src={closeIconSrc} />
        Close
        </button>
      </div>
      <FilterColumn
        {...filterColumnProps}
      />
      <button className="quill-button primary contained medium focus-on-light" onClick={closeMobileFilterMenu} type="button">
      Apply
      </button>
    </section>
  )
}

export default MobileFilterMenu
