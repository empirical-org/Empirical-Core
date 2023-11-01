import * as React from 'react'
import { Spinner, DataTable, noResultsMessage, DropdownInput } from '../../../Shared/index'
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import {
  DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
  groupByDropdownOptions,
  DIAGNOSTIC_NAME_TOOLTIP_TEXT,
  PRE_DIAGNOSTIC_COMPLETED_TOOLTIP_TEXT,
  COMPLETED_ACTIVITIES_TOOLTIP_TEXT,
  AVERAGE_ACTIVITIES_AND_TIME_SPENT_TOOLTIP_TEXT,
  POST_DIAGNOSTIC_COMPLETED_TOOLTIP_TEXT,
  OVERALL_SKILL_GROWTH_TOOLTIP_TEXT
} from '../../shared'

const DIAGNOSTIC_NAME = 'Diagnostic Name'
const PRE_DIAGNOSTIC_COMPLETED = 'Pre Diagnostic Completed'
const COMPLETED_ACTIVITIES = 'Completed Activities'
const AVERAGE_ACTIVITIES_AND_TIME_SPENT = 'Average Activities & Time Spent'
const POST_DIAGNOSTIC_COMPLETED = 'Post Diagnostic Completed'
const OVERALL_SKILL_GROWTH = 'Overall Skill Growth'

const headers = [
  {
    name: DIAGNOSTIC_NAME,
    attribute: 'name',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: DIAGNOSTIC_NAME,
    tooltipDescription: DIAGNOSTIC_NAME_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: PRE_DIAGNOSTIC_COMPLETED,
    attribute: 'preDiagnosticCompleted',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: PRE_DIAGNOSTIC_COMPLETED,
    tooltipDescription: PRE_DIAGNOSTIC_COMPLETED_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: COMPLETED_ACTIVITIES,
    attribute: 'studentsCompletedPractice',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: COMPLETED_ACTIVITIES,
    tooltipDescription: COMPLETED_ACTIVITIES_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'averageActivitiesAndTimeSpent',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Average Activities &',
    secondaryTitle: 'Time Spent',
    tooltipName: AVERAGE_ACTIVITIES_AND_TIME_SPENT,
    tooltipDescription: AVERAGE_ACTIVITIES_AND_TIME_SPENT_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'postDiagnosticCompleted',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Post Diagnostic',
    secondaryTitle: 'Completed',
    tooltipName: POST_DIAGNOSTIC_COMPLETED,
    tooltipDescription: POST_DIAGNOSTIC_COMPLETED_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Overall Skill Growth',
    attribute: 'overallSkillGrowth',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: OVERALL_SKILL_GROWTH,
    tooltipDescription: OVERALL_SKILL_GROWTH_TOOLTIP_TEXT,
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
      <div className="growth-reports-table-container">
        <DataTable
          className="growth-diagnostic-reports-overview-table reporting-format"
          emptyStateMessage={noResultsMessage('diagnostic')}
          headers={headers}
          rows={[]}
        />
      </div>
    </React.Fragment>
  )
}

export default OverviewSection;
