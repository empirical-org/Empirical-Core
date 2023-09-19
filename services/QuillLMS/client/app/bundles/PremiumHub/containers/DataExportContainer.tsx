import * as React from 'react'

import { FULL, restrictedPage, mapItemsIfNotAll } from '../shared';
import { Spinner } from '../../Shared/index'
import DataExportTableAndFields from '../components/dataExportTableAndFields';

const filterIconSrc = `${process.env.CDN_URL}/images/icons/icons-filter.svg`

export const DataExportContainer = ({
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
    <main className="data-export-main">
      <div className="header">
        <h1>Data Export</h1>
        <button className="quill-button contained primary medium focus-on-light" onClick={handleClickDownloadReport} type="button">Download Report</button>
      </div>
      <div className="filter-button-container">
        <button className="interactive-wrapper focus-on-light" onClick={openMobileFilterMenu} type="button">
          <img alt="Filter icon" src={filterIconSrc} />
          Filters
        </button>
      </div>
      <DataExportTableAndFields
        customTimeframeEnd={customEndDate?.toDate()}
        customTimeframeStart={customStartDate?.toDate()}
        key="data-export-table-and-fields"
        pusherChannel={pusherChannel}
        queryKey="data-export"
        searchCount={searchCount}
        selectedClassroomIds={mapItemsIfNotAll(selectedClassrooms, allClassrooms)}
        selectedGrades={mapItemsIfNotAll(selectedGrades, allGrades, 'value')}
        selectedSchoolIds={selectedSchools.map(school => school.id)}
        selectedTeacherIds={mapItemsIfNotAll(selectedTeachers, allTeachers)}
        selectedTimeframe={selectedTimeframe.value}
      />
    </main>
  )
}

export default DataExportContainer;
