import * as React from 'react'
import { Spinner, DataTable, noResultsMessage, DropdownInput } from '../../../Shared/index'
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import { diagnosticTypeDropdownOptions, groupByDropdownOptions, hashPayload } from '../../shared'
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
    width: '133px',
    noTooltip: true,
    isSortable: true
  },
  {
    name: '',
    attribute: 'preSkillScore',
    width: DEFAULT_CELL_WIDTH,
    primaryTitle: 'Pre',
    secondaryTitle: 'Skill Score',
    tooltipName: 'Pre Skill Score',
    tooltipDescription: preSkillScoreTooltipText,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'postSkillScore',
    width: DEFAULT_CELL_WIDTH,
    primaryTitle: 'Post',
    secondaryTitle: 'Skill Score',
    tooltipName: 'Post Skill Score',
    tooltipDescription: postSkillScoreTooltipText,
    noTooltip: true,
    isSortable: false
  },
  {
    name: GROWTH_RESULTS,
    attribute: 'growthResults',
    width: DEFAULT_CELL_WIDTH,
    tooltipName: GROWTH_RESULTS,
    tooltipDescription: growthResultsTooltipText,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'studentsImprovedSkill',
    width: DEFAULT_CELL_WIDTH,
    primaryTitle: 'Students',
    secondaryTitle: 'Improved Skill',
    tooltipName: 'Students Improved Skills',
    tooltipDescription: studentsImprovedSkillTooltipText,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'studentsWithoutImprovement',
    width: '160px',
    primaryTitle: 'Students',
    secondaryTitle: 'Without Improvement',
    tooltipName: 'Students Without Improvement',
    tooltipDescription: studentsWithoutImprovementTooltipText,
    noTooltip: true,
    isSortable: false
  },
  {
    name: '',
    attribute: 'studentsMaintainedProficiency',
    width: '154px',
    primaryTitle: 'Students Maintained',
    secondaryTitle: 'Proficiency',
    tooltipName: 'Students Maintained Proficiency',
    tooltipDescription: studentsMaintainedProficiencyTooltipText,
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
  pusherChannel,
  selectedDiagnosticId,
  passedData
}) => {

  const [groupByValue, setGroupByValue] = React.useState<DropdownObjectInterface>(groupByDropdownOptions[0])
  const [diagnosticTypeValue, setDiagnosticTypeValue] = React.useState<DropdownObjectInterface>(getInitialDiagnosticType())
  const [pusherMessage, setPusherMessage] = React.useState<string>(null)
  const [skillsData, setSkillsData] = React.useState<any>(null);
  const [aggregatedData, setAggregatedData] = React.useState<any>(passedData || []);
  const [loading, setLoading] = React.useState<boolean>(!passedData);

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel])

  React.useEffect(() => {
    if (!passedData) {
      // this is for testing purposes; this value will always be null in a non-testing environment
      getData()
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
      if (!body.hasOwnProperty('results')) {
        return
      } else {
        const { results, } = body
        setSkillsData(results)
      }
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

  function handleDiagnosticTypeOptionChange(option) {
    setDiagnosticTypeValue(option)
  }

  function handleGroupByOptionChange(option) {
    setGroupByValue(option)
  }

  function getInitialDiagnosticType() {
    if (selectedDiagnosticId) {
      return diagnosticTypeDropdownOptions.filter(diagnosticType => diagnosticType.value === selectedDiagnosticId)[0]
    }
    return diagnosticTypeDropdownOptions[0]
  }

  function renderContent() {
    if (loading) {
      return <Spinner />
    }
    return (
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
      {renderContent()}
    </React.Fragment>
  )
}

export default SkillSection;
