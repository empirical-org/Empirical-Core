import * as React from 'react'
import { Spinner, DataTable, noResultsMessage, DropdownInput } from '../../../Shared/index'
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import { DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH, diagnosticTypeDropdownOptions, groupByDropdownOptions } from '../../shared'

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
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'postSkillScore',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Post',
    secondaryTitle: 'Skill Score',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Growth Results',
    attribute: 'growthResults',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: 'Students Improved Skill',
    attribute: 'studentsImprovedSkill',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'studentsRecommendedPractice',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Students',
    secondaryTitle: 'Recommended Practice',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'studentsMaintainedProficiency',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Students Maintained',
    secondaryTitle: 'Proficiency',
    tooltipName: '',
    tooltipDescription: '',
    noTooltip: true,
    isSortable: false
  },
]


export const SkillSection = ({
  searchCount,
  selectedGrades,
  selectedSchoolIds,
  selectedTeacherIds,
  selectedClassroomIds,
  selectedTimeframe,
  pusherChannel
}) => {

  const [groupByValue, setGroupByValue] = React.useState<DropdownObjectInterface>(groupByDropdownOptions[0])
  const [diagnosticTypeValue, setDiagnosticTypeValue] = React.useState<DropdownObjectInterface>(diagnosticTypeDropdownOptions[0])

  function handleDiagnosticTypeOptionChange(option) {
    setDiagnosticTypeValue(option)
  }

  function handleGroupByOptionChange(option) {
    setGroupByValue(option)
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
