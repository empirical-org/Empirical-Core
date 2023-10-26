import * as React from 'react'
import { Spinner, DataTable, noResultsMessage, DropdownInput } from '../../../Shared/index'
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import { DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH, POST_QUESTIONS_CORRECT_TOOLTIP_TEXT, POST_SKILLS_IMPROVED_OR_MAINTAINED_TOOLTIP_TEXT, PRE_QUESTIONS_CORRECT_TOOLTIP_TEXT, PRE_SKILLS_PROFICIENT_TOOLTIP_TEXT, PRE_TO_POST_IMPROVED_SKILLS_TOOLTIP_TEXT, TOTAL_ACTIVITIES_AND_TIME_SPENT_TOOLTIP_TEXT, diagnosticTypeDropdownOptions } from '../../shared'

const PRE_TO_POST_IMPROVED_SKILLS = "Pre to Post: Improved Skills"
const PRE_QUESTIONS_CORRECT = "Pre: Questions Correct"
const PRE_SKILLS_PROFICIENT = "Pre: Skills Proficient"
const TOTAL_ACTIVITIES_AND_TIME_SPENT = "Total Activities & Time Spent"
const POST_QUESTIONS_CORRECT = 'Post: Questions Correct'
const POST_SKILLS_IMPROVED_OR_MAINTAINED = 'Post: Skills Improved Or Maintained'

const headers = [
  {
    name: 'Student Name',
    attribute: 'name',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'preToPostImprovedSkills',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Pre to Post:',
    secondaryTitle: 'Improved Skills',
    tooltipName: PRE_TO_POST_IMPROVED_SKILLS,
    tooltipDescription: PRE_TO_POST_IMPROVED_SKILLS_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'preQuestionsCorrect',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Pre:',
    secondaryTitle: 'Questions Correct',
    tooltipName: PRE_QUESTIONS_CORRECT,
    tooltipDescription: PRE_QUESTIONS_CORRECT_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'preSkillsProficient',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Pre:',
    secondaryTitle: 'Skills Proficient',
    tooltipName: PRE_SKILLS_PROFICIENT,
    tooltipDescription: PRE_SKILLS_PROFICIENT_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'totalActivitiesAndTimespent',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Total Activities &',
    secondaryTitle: 'Time Spent',
    tooltipName: TOTAL_ACTIVITIES_AND_TIME_SPENT,
    tooltipDescription: TOTAL_ACTIVITIES_AND_TIME_SPENT_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'postQuestionsCorrect',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Post:',
    secondaryTitle: 'Questions Correct',
    tooltipName: POST_QUESTIONS_CORRECT,
    tooltipDescription: POST_QUESTIONS_CORRECT_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'postSkillsImprovedOrMaintained',
    width: DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH,
    primaryTitle: 'Post: Skills',
    secondaryTitle: 'Improved Or Maintained',
    tooltipName: POST_SKILLS_IMPROVED_OR_MAINTAINED,
    tooltipDescription: POST_SKILLS_IMPROVED_OR_MAINTAINED_TOOLTIP_TEXT,
    noTooltip: true,
    isSortable: false
  },
]


export const StudentSection = ({
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

  const [diagnosticTypeValue, setDiagnosticTypeValue] = React.useState<DropdownObjectInterface>(diagnosticTypeDropdownOptions[0])

  function handleDiagnosticTypeOptionChange(option) {
    setDiagnosticTypeValue(option)
  }

  if (loadingFilters) {
    return <Spinner />
  }

  return (
    <React.Fragment>
      <DropdownInput
        className="diagnostic-type-dropdown"
        handleChange={handleDiagnosticTypeOptionChange}
        isSearchable={true}
        label="Diagnostic:"
        options={diagnosticTypeDropdownOptions}
        value={diagnosticTypeValue}
      />
      <DataTable
        className="growth-diagnostic-reports-by-skill-table reporting-format"
        emptyStateMessage={noResultsMessage('diagnostic')}
        headers={headers}
        rows={[]}
      />
    </React.Fragment>
  )
}

export default StudentSection;
