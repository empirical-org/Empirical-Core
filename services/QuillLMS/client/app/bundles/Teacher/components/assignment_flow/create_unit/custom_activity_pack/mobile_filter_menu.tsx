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
  gradeLevelFilters: number[],
  handleGradeLevelFilterChange: (gradeLevelFilters: number[]) => void,
  activityCategoryFilters: number[],
  handleActivityCategoryFilterChange: (activityCategoryFilters: number[]) => void,
  filterActivities: (ignoredKey?: string) => Activity[],
  setShowMobileFilterMenu: (show: boolean) => void,
  showMobileFilterMenu: boolean,
  contentPartnerFilters: number[],
  handleContentPartnerFilterChange: (contentPartnerFilters: number[]) => void,
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
  gradeLevelFilters,
  handleActivityCategoryFilterChange,
  handleActivityClassificationFilterChange,
  handleGradeLevelFilterChange,
  resetAllFilters,
  showMobileFilterMenu,
  setShowMobileFilterMenu
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
      contentPartnerFilters={contentPartnerFilters}
      filterActivities={filterActivities}
      filteredActivities={filteredActivities}
      gradeLevelFilters={gradeLevelFilters}
      handleActivityCategoryFilterChange={handleActivityCategoryFilterChange}
      handleActivityClassificationFilterChange={handleActivityClassificationFilterChange}
      handleContentPartnerFilterChange={handleContentPartnerFilterChange}
      handleGradeLevelFilterChange={handleGradeLevelFilterChange}
      resetAllFilters={resetAllFilters}
    />
    <button className="quill-button primary contained medium focus-on-light" onClick={closeMobileFilterMenu} type="button">
      Apply
    </button>
  </section>)
}

export default MobileFilterMenu
