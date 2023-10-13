import * as React from 'react'
import { Spinner, DataTable, noResultsMessage } from '../../../Shared/index'

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
    name: '',
    attribute: 'averageActivitiesAndTimeSpent',
    width: DEFAULT_CELL_WIDTH,
    primaryTitle: 'Average Activities &',
    secondaryTitle: 'Time Spent',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'postDiagnosticCompleted',
    width: DEFAULT_CELL_WIDTH,
    primaryTitle: 'Post Diagnostic',
    secondaryTitle: 'Completed',
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
      emptyStateMessage={noResultsMessage('diagnostic')}
      headers={headers}
      rows={[]}
    />
  )
}

export default OverviewTable;
