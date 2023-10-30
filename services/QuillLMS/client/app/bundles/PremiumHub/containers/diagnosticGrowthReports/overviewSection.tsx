import * as React from 'react'
import { Spinner, DataTable, noResultsMessage, DropdownInput } from '../../../Shared/index'
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import { DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH, groupByDropdownOptions } from '../../shared'

const headers = [
  {
    name: 'Diagnostic Name',
    attribute: 'name',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Pre Diagnostic Completed',
    attribute: 'preDiagnosticCompleted',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Completed Activities',
    attribute: 'studentsCompletedPractice',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'averageActivitiesAndTimeSpent',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
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
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
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
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  }
]


export const OverviewSection = ({
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

  const [groupByValue, setGroupByValue] = React.useState<DropdownObjectInterface>(groupByDropdownOptions[0])

  function handleFilterOptionChange(option) {
    setGroupByValue(option)
  }

  if (loadingFilters) {
    return <Spinner />
  }

  return (
    <React.Fragment>
      <DropdownInput
        className="group-by-dropdown"
        handleChange={handleFilterOptionChange}
        isSearchable={true}
        label="Group by:"
        options={groupByDropdownOptions}
        value={groupByValue}
      />
      <DataTable
        className="growth-diagnostic-reports-overview-table reporting-format"
        emptyStateMessage={noResultsMessage('diagnostic')}
        headers={headers}
        rows={[]}
      />
    </React.Fragment>
  )
}

export default OverviewSection;
