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
  availableClassrooms,
  selectedGrades,
  availableGrades,
  selectedSchools,
  selectedTeachers,
  availableTeachers,
  selectedTimeframe,
  openMobileFilterMenu
}) => {

  if (loadingFilters) {
    return <Spinner />
  }

  if (accessType !== FULL) {
    return restrictedPage
  }

  return (
    <main>
      <DataExportTableAndFields
        customTimeframeEnd={customEndDate?.toDate()}
        customTimeframeStart={customStartDate?.toDate()}
        key="data-export-table-and-fields"
        openMobileFilterMenu={openMobileFilterMenu}
        pusherChannel={pusherChannel}
        queryKey="data-export"
        searchCount={searchCount}
        selectedClassroomIds={mapItemsIfNotAll(selectedClassrooms, availableClassrooms)}
        selectedGrades={mapItemsIfNotAll(selectedGrades, availableGrades, 'value')}
        selectedSchoolIds={selectedSchools.map(school => school.id)}
        selectedTeacherIds={mapItemsIfNotAll(selectedTeachers, availableTeachers)}
        selectedTimeframe={selectedTimeframe.value}
      />
    </main>
  )
}

export default DataExportContainer;
