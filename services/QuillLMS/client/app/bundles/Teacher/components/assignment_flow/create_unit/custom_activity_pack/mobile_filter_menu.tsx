import * as React from 'react';

import { Activity, ActivityCategoryEditor, Topic } from './interfaces'
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
  gradeLevelFilters: number[],
  handleGradeLevelFilterChange: (gradeLevelFilters: number[]) => void,
  ellFilters: number[],
  handleELLFilterChange: (ellFilters: number[]) => void,
  activityCategoryFilters: number[],
  handleActivityCategoryFilterChange: (activityCategoryFilters: number[]) => void,
  filterActivities: (ignoredKey?: string) => Activity[],
  setShowMobileFilterMenu: (show: boolean) => void,
  showMobileFilterMenu: boolean,
  contentPartnerFilters: number[],
  handleContentPartnerFilterChange: (contentPartnerFilters: number[]) => void,
  earlyAccessFilters: string[],
  handleEarlyAccessFilterChange: (earlyAccessFilters: string[]) => void,
  readabilityGradeLevelFilters: number[],
  handleReadabilityGradeLevelFilterChange: (readabilityGradeLevelFilters: number[]) => void,
  topicFilters: number[],
  handleTopicFilterChange: (topicFilters: number[]) => void,
  savedActivityFilters: number[],
  handleSavedActivityFilterChange: () => void,
  savedActivityIds: number[],
  flagFilters: string[],
  handleFlagFilterChange: () => void,
  flagset: string,
  isStaff?: boolean,
  activityCategoryEditor?: ActivityCategoryEditor,
  topics: Topic[],
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
  ellFilters,
  gradeLevelFilters,
  readabilityGradeLevelFilters,
  handleActivityCategoryFilterChange,
  handleActivityClassificationFilterChange,
  handleCCSSGradeLevelFilterChange,
  handleGradeLevelFilterChange,
  handleELLFilterChange,
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
  flagFilters,
  handleFlagFilterChange,
  activityCategoryEditor,
  earlyAccessFilters,
  handleEarlyAccessFilterChange,
  flagset,
  topics,
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
    gradeLevelFilters,
    ellFilters,
    handleActivityCategoryFilterChange,
    handleELLFilterChange,
    handleActivityClassificationFilterChange,
    handleContentPartnerFilterChange,
    handleCCSSGradeLevelFilterChange,
    handleGradeLevelFilterChange,
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
    activityCategoryEditor,
    earlyAccessFilters,
    handleEarlyAccessFilterChange,
    flagset,
    topics,
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
