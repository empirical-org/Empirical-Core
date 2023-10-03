import * as React from 'react';

import { Spinner } from '../../Shared/index';
import DataExportTableAndFields from '../components/dataExportTableAndFields';
import { FULL, mapItemsIfNotAll, restrictedPage } from '../shared';



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
  //handleClickDownloadReport,
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

      <DataExportTableAndFields
        customTimeframeEnd={customEndDate?.toDate()}
        customTimeframeStart={customStartDate?.toDate()}
        key="data-export-table-and-fields"
        openMobileFilterMenu={openMobileFilterMenu}
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
