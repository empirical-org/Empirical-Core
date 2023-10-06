import * as React from 'react'
import { Spinner, DataTable, NO_RESULTS_MESSAGE } from '../../../Shared/index'

const DEFAULT_CELL_WIDTH = '182px'

const headers = [
  {
    name: 'Diagnostic Name',
    attribute: 'name',
    width: DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Pre Diagnostic Completed',
    attribute: 'preDiagnosticCompleted',
    width: DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Completed Activities',
    attribute: 'studentsCompletedPractice',
    width: DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Average Activities & Time Spent',
    attribute: 'averageActivitiesAndTimeSpent',
    width: DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Post Diagnostic Completed',
    attribute: 'postDiagnosticCompleted',
    width: DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Overall Skill Growth',
    attribute: 'overallSkillGrowth',
    width: DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  }
]


export const OverviewTable = ({
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

  return (
    <DataTable
      className="growth-diagnostic-reports-overview-table reporting-format"
      emptyStateMessage={NO_RESULTS_MESSAGE}
      headers={headers}
      rows={[]}
    />
  )
}

export default OverviewTable;
