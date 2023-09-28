import * as React from 'react'

import { FULL, restrictedPage, mapItemsIfNotAll } from '../../shared';
import { Spinner } from '../../../Shared/index'

const filterIconSrc = `${process.env.CDN_URL}/images/icons/icons-filter.svg`

export const OverviewContainer = ({
  accessType,
  loadingFilters,
  customStartDate,
  customEndDate,
  pusherChannel,
  searchCount,
  selectedClassrooms,
  allClassrooms,
  selectedGrades,
  allGrades,
  selectedSchools,
  selectedTeachers,
  allTeachers,
  selectedTimeframe,
  handleClickDownloadReport,
  openMobileFilterMenu
}) => {

  if (loadingFilters) {
    return <Spinner />
  }

  if (accessType !== FULL) {
    return restrictedPage
  }

  return (
    <main className="diagnostic-reports-main">
      <div className="header">
        <h1>
          <span>Diagnostic Growth Report</span>
          <a href="" rel="noopener noreferrer" target="_blank">
            <img alt="" src={`${process.env.CDN_URL}/images/icons/file-document.svg`} />
            <span>Guide</span>
          </a>
        </h1>
        <div className="buttons-container">
          <button className="quill-button contained primary medium focus-on-light" onClick={handleClickDownloadReport} type="button">Manage Subscription</button>
          <button className="quill-button contained primary medium focus-on-light" onClick={handleClickDownloadReport} type="button">Download Report</button>
        </div>
      </div>
      <div className="filter-button-container">
        <button className="interactive-wrapper focus-on-light" onClick={openMobileFilterMenu} type="button">
          <img alt="Filter icon" src={filterIconSrc} />
          Filters
        </button>
      </div>
    </main>
  )
}

export default OverviewContainer;
