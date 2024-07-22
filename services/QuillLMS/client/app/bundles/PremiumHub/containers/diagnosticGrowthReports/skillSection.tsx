import * as React from 'react'
import { Spinner, DataTable, noResultsMessage, DropdownInput } from '../../../Shared/index'
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import { getDiagnosticTypeDropdownOptionsByTimeframe, groupByDropdownOptions, hashPayload } from '../../shared'
import { requestPost } from '../../../../modules/request'
import { aggregateSkillsData, growthResultsTooltipText, postSkillScoreTooltipText, preSkillScoreTooltipText, studentsImprovedSkillTooltipText, studentsMaintainedProficiencyTooltipText, studentsWithoutImprovementTooltipText } from './helpers'

const QUERY_KEY = "diagnostic-skills"
const PUSHER_EVENT_KEY = "admin-diagnostic-skills-cached";
const DEFAULT_CELL_WIDTH = '142px'
const GROWTH_RESULTS = 'Growth Results'

const headers = [
  {
    name: 'Skill',
    attribute: 'name',
    width: '132px',
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'preSkillScore',
    sortAttribute: 'pre_score',
    width: '132px',
    primaryTitle: 'Pre',
    secondaryTitle: 'Skill Score',
    tooltipName: 'Pre Skill Score',
    tooltipDescription: preSkillScoreTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'postSkillScore',
    sortAttribute: 'post_score',
    width: '132px',
    primaryTitle: 'Post',
    secondaryTitle: 'Skill Score',
    tooltipName: 'Post Skill Score',
    tooltipDescription: postSkillScoreTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: GROWTH_RESULTS,
    attribute: 'growthResults',
    sortAttribute: 'growthResultsSortValue',
    width: '150px',
    tooltipName: GROWTH_RESULTS,
    tooltipDescription: growthResultsTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'studentsImprovedSkill',
    sortAttribute: 'improved_proficiency',
    width: DEFAULT_CELL_WIDTH,
    primaryTitle: 'Students',
    secondaryTitle: 'Improved Skill',
    tooltipName: 'Students Improved Skill',
    tooltipDescription: studentsImprovedSkillTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'studentsWithoutImprovement',
    sortAttribute: 'recommended_practice',
    width: '160px',
    primaryTitle: 'Students Without',
    secondaryTitle: 'Improvement',
    tooltipName: 'Students Without Improvement',
    tooltipDescription: studentsWithoutImprovementTooltipText,
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'studentsMaintainedProficiency',
    sortAttribute: 'maintained_proficiency',
    width: '168px',
    primaryTitle: 'Students Maintained',
    secondaryTitle: 'Proficiency',
    tooltipName: 'Students Maintained Proficiency',
    tooltipDescription: studentsMaintainedProficiencyTooltipText,
    noTooltip: true,
    isSortable: true
  },
]


export const SkillSection = ({
  searchCount,
  selectedGrades,
  selectedSchoolIds,
  selectedTeacherIds,
  selectedClassroomIds,
  selectedTimeframe,
  pusherChannel,
  diagnosticTypeValue,
  groupByValue,
  handleSetDiagnosticIdForStudentCount,
  handleSetSelectedDiagnosticType,
  handleSetSelectedGroupByValue,
  passedData
}) => {
  const [pusherMessage, setPusherMessage] = React.useState<string>(null)
  const [skillsData, setSkillsData] = React.useState<any>(null);
  const [aggregatedData, setAggregatedData] = React.useState<any>(passedData || []);
  const [loading, setLoading] = React.useState<boolean>(!passedData);

  React.useEffect(() => {
    handleSetDiagnosticIdForStudentCount(null)
  }, [])

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel])

  React.useEffect(() => {
    if (!passedData && groupByValue && diagnosticTypeValue) {
      // this is for testing purposes; this value will always be null in a non-testing environment

      // If the timeframe has changed, we may be re-populating the selectedDiagnosticType drop-downs
      // In these cases, we need to re-select the appropriate value from the drop-down for the new timeframe
      // The re-selection will re-trigger this effect by changing the value of diagnosticTypeValue
      const diagnosticTypeDropdownOptions = getDiagnosticTypeDropdownOptionsByTimeframe(selectedTimeframe)
      if (!diagnosticTypeDropdownOptions.includes(diagnosticTypeValue)) {
        const selectedDiagnosticType = diagnosticTypeDropdownOptions.find((option) => option.label === diagnosticTypeValue.label)

        handleSetSelectedDiagnosticType(selectedDiagnosticType)
      } else {
        getData()
      }
    }
  }, [searchCount, groupByValue, diagnosticTypeValue])

  React.useEffect(() => {
    if (!pusherMessage) return

    if (filtersMatchHash(pusherMessage)) getData()
  }, [pusherMessage])

  React.useEffect(() => {
    if (skillsData) {
      aggregateSkillsData({
        skillsData,
        setAggregatedData,
        setLoading
      })
    }
  }, [skillsData])

  function initializePusher() {
    pusherChannel?.bind(PUSHER_EVENT_KEY, (body) => {
      const { message, } = body

      setPusherMessage(message)
    });
  };

  function getData() {
    setLoading(true)
    const searchParams = {
      query: QUERY_KEY,
      timeframe: selectedTimeframe,
      school_ids: selectedSchoolIds,
      teacher_ids: selectedTeacherIds,
      classroom_ids: selectedClassroomIds,
      grades: selectedGrades,
      group_by: groupByValue.value,
      diagnostic_id: diagnosticTypeValue.value
    }

    requestPost('/admin_diagnostic_skills/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) { return }
      const { results, } = body
      setSkillsData(results)
    })
  }

  function filtersMatchHash(hashMessage) {
    const filterTarget = [].concat(
      QUERY_KEY,
      groupByValue.value,
      parseInt(diagnosticTypeValue.value),
      selectedTimeframe,
      selectedSchoolIds,
      selectedGrades,
      selectedTeacherIds,
      selectedClassroomIds,
    )

    const filterHash = hashPayload(filterTarget)

    return hashMessage == filterHash
  }

  function handleDiagnosticTypeOptionChange(option: DropdownObjectInterface) {
    handleSetSelectedDiagnosticType(option)
  }

  function handleGroupByOptionChange(option: DropdownObjectInterface) {
    handleSetSelectedGroupByValue(option)
  }

  function renderContent() {
    if(loading) {
      return <Spinner />
    }
    return(
      <DataTable
        className="growth-diagnostic-reports-by-skill-table reporting-format"
        emptyStateMessage={noResultsMessage('diagnostic')}
        headers={headers}
        rows={aggregatedData}
      />
    )
  }

  return (
    <React.Fragment>
      <div className="dropdowns-container">
        <DropdownInput
          className="diagnostic-type-dropdown"
          handleChange={handleDiagnosticTypeOptionChange}
          isSearchable={true}
          label="Diagnostic:"
          options={getDiagnosticTypeDropdownOptionsByTimeframe(selectedTimeframe)}
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
      {renderContent()}
    </React.Fragment>
  )
}

export default SkillSection;
