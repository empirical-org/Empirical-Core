import * as React from 'react'
import { Spinner, DataTable, noResultsMessage, DropdownInput } from '../../../Shared/index'
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import { DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH, GROWTH_RESULTS_TOOLTIP_TEXT, POST_SKILL_SCORE_TOOLTIP_TEXT, PRE_SKILL_SCORE_TOOLTIP_TEXT, STUDENTS_IMPROVED_SKILL_TOOLTIP_TEXT, STUDENTS_MAINTAINED_PROFICIENCY_TOOLTIP_TEXT, STUDENTS_WITHOUT_IMPROVEMENT_TOOLTIP_TEXT, diagnosticTypeDropdownOptions, groupByDropdownOptions } from '../../shared'

const PRE_SKILL_SCORE = "Pre Skill Score"
const POST_SKILL_SCORE = "Post Skill Score"
const GROWTH_RESULTS = "Growth Results"
const STUDENTS_IMPROVED_SKILL = "Students Improved Skill"
const STUDENTS_WITHOUT_IMPROVEMENT = "Students Without Improvement"
const STUDENTS_MAINTAINED_PROFICIENCY = "Students Maintained Proficiency"

const headers = [
  {
    name: 'Skill',
    attribute: 'skill',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'preSkillScore',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Pre',
    secondaryTitle: 'Skill Score',
    tooltipName: PRE_SKILL_SCORE,
    tooltipDescription: PRE_SKILL_SCORE_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'postSkillScore',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Post',
    secondaryTitle: 'Skill Score',
    tooltipName: POST_SKILL_SCORE,
    tooltipDescription: POST_SKILL_SCORE_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: GROWTH_RESULTS,
    attribute: 'growthResults',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: GROWTH_RESULTS,
    tooltipDescription: GROWTH_RESULTS_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: STUDENTS_IMPROVED_SKILL,
    attribute: 'studentsImprovedSkill',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: STUDENTS_IMPROVED_SKILL,
    tooltipDescription: STUDENTS_IMPROVED_SKILL_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'studentsWithoutImprovement',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Students',
    secondaryTitle: 'Without Improvement',
    tooltipName: STUDENTS_WITHOUT_IMPROVEMENT,
    tooltipDescription: STUDENTS_WITHOUT_IMPROVEMENT_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'studentsMaintainedProficiency',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Students Maintained',
    secondaryTitle: 'Proficiency',
    tooltipName: STUDENTS_MAINTAINED_PROFICIENCY,
    tooltipDescription: STUDENTS_MAINTAINED_PROFICIENCY_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
]


export const SkillSection = ({
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
  const [diagnosticTypeValue, setDiagnosticTypeValue] = React.useState<DropdownObjectInterface>(diagnosticTypeDropdownOptions[0])

  function handleDiagnosticTypeOptionChange(option) {
    setDiagnosticTypeValue(option)
  }

  function handleGroupByOptionChange(option) {
    setGroupByValue(option)
  }

  if (loadingFilters) {
    return <Spinner />
  }

  return (
    <React.Fragment>
      <div className="dropdowns-container">
        <DropdownInput
          className="diagnostic-type-dropdown"
          handleChange={handleDiagnosticTypeOptionChange}
          isSearchable={true}
          label="Diagnostic:"
          options={diagnosticTypeDropdownOptions}
          value={diagnosticTypeValue}
        />
        <DropdownInput
          className="group-by-dropdown"
          handleChange={handleGroupByOptionChange}
          isSearchable={true}
          label="Group by:"
          options={groupByDropdownOptions}
          value={groupByValue}
        />
      </div>
      <DataTable
        className="growth-diagnostic-reports-by-skill-table reporting-format"
        emptyStateMessage={noResultsMessage('diagnostic')}
        headers={headers}
        rows={[]}
      />
    </React.Fragment>
  )
}

export default SkillSection;
